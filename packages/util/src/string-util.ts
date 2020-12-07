/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/27
 **/

/**
 * form.input => FormInput
 * form-input => FormInput
 *
 * ICheckArea4socialSecurity   =>ICheckArea4SocialSecurity
 * @param {string} name
 * @returns {any}
 */
export function toUCamelize(name: string): string {
  return name
    .replace(/([0-9])([a-z])/g, (_, num: number, char: string) => {
      return `${num}${char.toUpperCase()}`;
    })
    .split(/[-_\.]/)
    .map((item) => {
      if (!item) {
        return "";
      }
      if (typeof item === "string") {
        return item[0].toUpperCase() + item.substr(1);
      } else {
        throw new Error(`传入参数不正确:${name} ${item}`);
      }
    })
    .join("");
}
//
export function toLCamelize(name: string): string {
  let camelName = toUCamelize(name);
  return camelName[0].toLowerCase() + camelName.substr(1);
}
