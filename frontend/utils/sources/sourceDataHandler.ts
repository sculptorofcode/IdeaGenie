// Example of using the source data APIs

/**
 * Save source data with proper sanitization
 * @param explorationId The ID of the exploration
 * @param source The source name (reddit, twitter, etc.)
 * @param keyword The keyword being explored
 * @param rawData The raw source data
 * @returns Response from the API
 */
export async function saveSourceData(explorationId: string, source: string, keyword: string, rawData: any[]) {
  // Step 1: Preprocess the data to ensure proper format
  const preprocessResponse = await fetch('/api/source/preprocess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: rawData })
  });
  
  const preprocessResult = await preprocessResponse.json();
  
  if (!preprocessResult.success) {
    console.error('Preprocessing failed:', preprocessResult.error);
    throw new Error(`Failed to preprocess data: ${preprocessResult.error}`);
  }
  
  // Step 2: Save the preprocessed data
  const saveResponse = await fetch('/api/source/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      explorationId,
      source,
      keyword,
      data: preprocessResult.data
    })
  });
  
  const saveResult = await saveResponse.json();
  
  if (!saveResponse.ok) {
    console.error('Save failed:', saveResult.error);
    throw new Error(`Failed to save data: ${saveResult.error}`);
  }
  
  return saveResult;
}

/**
 * For complex data with comments that may cause validation issues
 * @param explorationId The ID of the exploration
 * @param source The source name
 * @param keyword The keyword
 * @param complexData Data with complex comment structures
 */
export async function saveComplexSourceData(explorationId: string, source: string, keyword: string, complexData: any[]) {
  // Step 1: Format the complex data (specifically for comments)
  const formatResponse = await fetch('/api/source/format', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: complexData,
      source,
      keyword
    })
  });
  
  const formatResult = await formatResponse.json();
  
  if (!formatResponse.ok) {
    console.error('Formatting failed:', formatResult.error);
    throw new Error(`Failed to format data: ${formatResult.error}`);
  }
  
  // Step 2: Clean the formatted data
  const cleanResponse = await fetch('/api/source/clean', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source,
      keyword,
      data: formatResult.data
    })
  });
  
  const cleanResult = await cleanResponse.json();
  
  if (!cleanResponse.ok) {
    console.error('Cleaning failed:', cleanResult.error);
    throw new Error(`Failed to clean data: ${cleanResult.error}`);
  }
  
  // Step 3: Save the cleaned data
  return saveSourceData(explorationId, source, keyword, cleanResult.data);
}
