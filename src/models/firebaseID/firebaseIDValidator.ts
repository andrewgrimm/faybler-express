export const validIDRegex = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/;

// Returns true if the input string meets the constraints of a firebase firestore document id
export const validID = (id: string): boolean => id.search(validIDRegex) !== -1;
