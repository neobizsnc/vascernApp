import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LanguageactiveProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LanguageactiveProvider {

  languageActive: String = "english";

  constructor(public http: HttpClient) {
    console.log('Hello LanguageactiveProvider Provider');
  }

  setLang(lng) {
    switch (lng) {
      case "en":
        this.languageActive = "english";
        break;
      case "it":
        this.languageActive = "italian";
        break;
      case "de":
        this.languageActive = "german";
        break;
      case "pt":
        this.languageActive = "portuguese";
        break;
      case "hu":
        this.languageActive = "hungarian";
        break;
      case "es":
        this.languageActive = "spanish";
        break;
      case "da":
        this.languageActive = "danish";
        break;
      case "el":
        this.languageActive = "greek";
        break;
      case "fi":
        this.languageActive = "finnish";
        break;
      case "hr":
        this.languageActive = "croatian";
        break;
      case "lt":
        this.languageActive = "lithuanian";
        break;
      case "lv":
        this.languageActive = "latvian";
        break;
      case "pl":
        this.languageActive = "polish";
        break;
      case "sl":
        this.languageActive = "slovenian";
        break;
      case "sv":
        this.languageActive = "swedish";
        break;
      case "sk":
        this.languageActive = "slovak";
        break;
      case "fr":
        this.languageActive = "french";
        break;
      case "ro":
        this.languageActive = "romanian";
        break;
      case "et":
        this.languageActive = "estonian";
        break;
      case "bg":
        this.languageActive = "bulgarian";
        break;
      case "mt":
        this.languageActive = "maltese";
        break;
      case "cs":
        this.languageActive = "czech";
        break;        
      default:
        this.languageActive = "english";
        break;
    }
  }

}
