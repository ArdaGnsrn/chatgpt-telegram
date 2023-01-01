import str from 'superscript-number';

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function convertExponentialToSymbol(text) {
    return text.replace(/\^\d+/g, (match) => str(match));
}