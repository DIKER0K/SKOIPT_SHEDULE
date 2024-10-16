import axios from "axios";

const CourceUrls = [
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/340-1-kurs',
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/341-2-kurs',
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/342-3-kurs',
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/343-4-kurs',
];

const parser = new DOMParser();



function getNextMondayTimestamp() {
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilMonday = currentDay === 0 ? 0 : 7 - currentDay;
  const nextMonday = new Date(
    now.getTime() + (daysUntilMonday+1) * 24 * 60 * 60 * 1000,
  );
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday.getTime();
}



export async function LoadGroups(handleProgress: Function): Promise<Boolean>
{
    let cources = JSON.parse(localStorage.getItem('cources') ?? '0');
  
    if (cources != 0 && cources.expires - Date.now() > 0) return true;


    // init
    cources = {};
    cources.expires = Date.now() + 1000 * 60 * 60 * 24 * 30; // next update
    let loaded: number = 0; // count loaded cources
    cources.groups = [];
  
    for (let groupI = 0; groupI < 4; groupI++) 
    {
        try
        {
            cources.groups[groupI] = [];
            
            let response = await axios.get(CourceUrls[groupI])
    
            const htmlDoc = parser.parseFromString(response.data, 'text/html');
    
            const groupsDoc = htmlDoc
              .querySelector('[itemprop="articleBody"]')
              ?.querySelectorAll('img');
    
            groupsDoc?.forEach((element) => {
              cources.groups[groupI].push(element.alt);
            });
            
            loaded++;
            handleProgress(loaded / CourceUrls.length * 100)
            if (loaded == CourceUrls.length) {
              localStorage.setItem('cources', JSON.stringify(cources));
              return true;
            }
        }
        catch {}
    }
    
    return false;
}

export async function LoadSchedule(handleProgress: Function): Promise<Boolean>
{
  let schedules = JSON.parse(localStorage.getItem('schedules') ?? '{"schedule": {}}');
  let isExpires = schedules.expires - Date.now() > 0

  schedules.expires = getNextMondayTimestamp();

  let cources = JSON.parse(localStorage.getItem('cources') ?? '{}').groups;


  for (let c = 0; c < cources.length; c++)
  {
    for (let g = 0; g < cources[c].length; g++)
    {
      handleProgress((c + g / cources[c].length) / cources.length * 100)
      if (isExpires && schedules["schedule"][cources[c][g]] != null)
      {
        continue;
      }
      try
      {
        console.log("request " + cources[c][g])
        schedules["schedule"][cources[c][g]] = await LoadGroup(cources[c][g])
      }
      catch 
      {
        console.log("error " + cources[c][g])
      }
    }
  }

  localStorage.setItem('schedules', JSON.stringify(schedules))

  return true;
}

async function LoadGroup(group: string): Promise<any>
{
  let response = await axios.get(`https://skoipt.ru/images/rs/Schedule_htm/${group}.htm`, { timeout: 10000, responseType: 'arraybuffer' })
  
  /*
   * schedule - matrix
   * [i] - rows
   * [j] - cells
   *
   * [i][j] -> [
   *  text, width, height, colspan, rowspan
   * ]
   */
  const schedule: any = [];
  const decoder = new TextDecoder('windows-1251');
  const decodedData = decoder.decode(new Uint8Array(response.data));
  const htmlDoc = parser.parseFromString(decodedData, 'text/html');
  const table = htmlDoc.querySelectorAll('.MsoNormalTable')[1];

  const rows = table.querySelectorAll('tr');
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    schedule[i] = [];
    for (let j = 0; j < cells.length; j++) {
      const style: any = [];

      style.push(cells[j].outerText);
      style.push(cells[j].style.width);
      style.push(cells[j].style.height);
      style.push(cells[j].colSpan);
      style.push(cells[j].rowSpan);

      schedule[i][j] = style;
    }
  }
  
  return schedule;
}