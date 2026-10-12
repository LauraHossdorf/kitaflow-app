export class InputError extends Error {}
export function name(value:FormDataEntryValue|null,label="Name") {
 if(typeof value!=="string"||!value.trim()||value.trim().length>120) throw new InputError(label+" muss 1–120 Zeichen enthalten.");
 return value.trim();
}
export function optionalCount(value:FormDataEntryValue|null) {
 if(value===null||value==="")return null;
 if(typeof value!=="string"||!/^\d+$/.test(value))throw new InputError("Bitte eine ganze, nicht negative Zahl eingeben.");
 const n=Number(value);
 if(!Number.isSafeInteger(n)||n>10000)throw new InputError("Zahl ist zu groß.");
 return n;
}

