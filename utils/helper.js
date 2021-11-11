var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const Uint8ArrayToString = (fileData) => {
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
    }
    return dataString;
};
export const formattedSelections = (selections) => {
    const iconsPromise = selections.map((c) => __awaiter(void 0, void 0, void 0, function* () {
        let svgCode = yield c.exportAsync({ format: "SVG" });
        svgCode = Uint8ArrayToString(svgCode);
        return { id: c.id, name: c.name, code: svgCode };
    }));
    return Promise.all(iconsPromise);
};
export const versionValue = (versions) => {
    return versions
        .split(".")
        .map((n) => n - 0)
        .reduce((accumulator, currentValue, index) => {
        return accumulator + currentValue * Math.pow(100, 2 - index);
    }, 0);
};
