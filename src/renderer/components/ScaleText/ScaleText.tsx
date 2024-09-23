const MaxFontSize = 100; // affects the number of calculations

interface ScaleTextProps 
{
    widthContainer: number;
    heightContainer: number;
    minSizeFont?: number;
    maxSizeFont?: number;
    children: string;
}

function canFit(fieldWidth: number, fieldHeight: number, numElements: number, elementWidth: number, elementHeight: number): Boolean
{
    const rows = Math.ceil(numElements / Math.floor(fieldWidth / elementWidth));
    return rows * elementHeight <= fieldHeight;
}

export default function(
{ 
    widthContainer, 
    heightContainer, 
    minSizeFont, 
    maxSizeFont, 
    children 
}: ScaleTextProps)
{
    const initialArea = (heightContainer * widthContainer) / children.length;
    const initialHeight = Math.sqrt(initialArea);   
    
    const initialWidth = initialHeight * 0.66;  
    
    let bestHeight = initialHeight;
    let bestWidth = initialHeight * 0.66;
    let bestArea = 0;
    for (let height = 0; height <= (maxSizeFont ?? MaxFontSize); height++) 
    {
        const width = height * 0.66;
        const currentArea = width * height * children.length; 
        
        if (canFit(widthContainer, heightContainer, children.length, width, height)) 
        {
            if (currentArea > bestArea) 
            {
                bestArea = currentArea;
                bestHeight = height;
                bestWidth = width;
            }
        }
    } 
    if (minSizeFont != null && bestHeight < minSizeFont)
    {
        bestHeight = minSizeFont
    }
    else if (maxSizeFont != null && bestHeight > maxSizeFont)
    {
        bestHeight = maxSizeFont
    }
  
    return (
        <div
            style={{
                fontSize: bestHeight,
                width: widthContainer,
                height: heightContainer
            }}
        >
            {children}
        </div>
      )
}