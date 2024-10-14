import axios from "axios";

const CourceUrls = [
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/340-1-kurs',
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/341-2-kurs',
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/342-3-kurs',
    'https://skoipt.ru/en/112-statichnye-stranitsy/studentu/raspisanie/raspisanie-zanyatij/343-4-kurs',
];

export async function LoadGroups(): Promise<Boolean>
{
    let cources = JSON.parse(localStorage.getItem('cources') ?? '0');
  
    if (cources != 0 && cources.expires - Date.now() > 0) return false;


    // init
    const parser = new DOMParser();
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
            if (loaded == 4) {
              localStorage.setItem('cources', JSON.stringify(cources));
              return true;
            }
        }
        catch {}
    }
    
    return false;
}