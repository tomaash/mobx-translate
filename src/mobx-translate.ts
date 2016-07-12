import * as Mustache from 'mustache';
import {observable, action} from "mobx";

export class MobxTranslate<T> {
  @observable lang: String;
  @observable key: T;
  strings: { [s: string]: T } = {};

  convertTemplates(object): T {
    var out: T = {} as T;
    Object.keys(object).forEach((key) => {
      if (typeof object[key] === 'string') {
        out[key] = function (view) {
          if (!view) {
            return object[key];
          } else if (view instanceof Object) {
            return Mustache.render(object[key], view);
          } else {
            console.error('Translate function expects either no parameter, or an object vith template variables');
          }
        }
      } else if (object[key] instanceof Object) {
        out[key] = this.convertTemplates(object[key]);
      }
    })
    return out;
  }

  @action loadStrings(identifier, data) {
    this.strings[identifier] = this.convertTemplates(data);
  }

  @action setLanguage(lang) {
    this.lang = lang
    this.key = this.strings[lang];
  }
}

