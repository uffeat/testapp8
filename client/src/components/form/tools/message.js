/* 
const { get_message } = await use("@/components/form/tools/message.js")
*/

export const get_message = (element) => {
const validity = element.validity;
    if (validity.valueMissing) {
      return "Required";
    }
    if (validity.typeMismatch) {
      return "Invalid format";
    }
    if (validity.tooShort) {
      return "Too short";
    }
    if (validity.tooLong) {
      return "Too long";
    }
    if (validity.rangeUnderflow) {
      return "Too small";
    }
    if (validity.rangeOverflow) {
      return "Too large";
    }
    if (validity.patternMismatch) {
      return "Invalid format";
    }
    if (validity.stepMismatch) {
      return "Invalid";
    }
    if (validity.badInput) {
      return "Invalid";
    }
    /* NOTE customError is handled elsewhere */
    return null;
}