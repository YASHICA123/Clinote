export const voiceService = {
  startDictation: async (): Promise<boolean> => {
    // Check microphone permission or start connection
    return true;
  },

  transcribeAudio: async (durationMs: number = 3000): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, durationMs + 1000));
    
    const mockTranscriptions = [
      "Patient is a 76-year-old male presenting with severe COPD exacerbation. Vitals: HR 84, SpO2 94% on room air. Lungs show diffuse wheezing. Plan is to start IV steroids and continue nebulization Q6H.",
      "Post-bronchodilator exam shows mild reduction in wheezing. Patient is comfortable, resting in bed. Instructed patient on proper dry powder inhaler technique.",
      "Chest X-Ray shows hyperinflation with flat diaphragms. ABG shows pH 7.37, pCO2 46 mmHg. Preparing patient for ward transfer from ICU.",
      "Reviewing medication list. Symbicort 200/6 2 puffs twice daily and Spiriva 18mcg once daily. Add Pantoprazole 40mg before breakfast for steroid protection."
    ];
    
    const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
    return mockTranscriptions[randomIndex];
  }
};
