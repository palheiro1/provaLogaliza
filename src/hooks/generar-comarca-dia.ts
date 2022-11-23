import { galicianComarcas } from "../domain/comarcas.position";
import { CountryCode } from "../domain/countries.position";

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate())
  ].join('-');
}

function addDay(date: Date) {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
}

let today = new Date();
const comarcas = galicianComarcas;
const comarcasDia: Record<string, CountryCode> = {};

while (comarcas.length > 0) {
  const random = Math.floor((Math.random() * 100)) % comarcas.length;
  const formattedDay: string = "\"" + formatDate(today) + "\"";
  comarcasDia[formattedDay] = comarcas[random].code;
  comarcas.splice(random, 1);
  today = addDay(today);
}

// Log to console
console.log(comarcasDia);

export { };

