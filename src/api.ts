export async function submitAssessment(message: string): Promise<any> {
  try {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf'
      },
      body: JSON.stringify({
        user_id: "katewamukul@gmail.com",
        agent_id: "683af84cc446a3a00dfef86c",
        session_id: "683af84cc446a3a00dfef86c-18amvsw1twg",
        message
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
}