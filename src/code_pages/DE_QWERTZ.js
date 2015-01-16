/* 
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


CodePages.DE_QWERTZ = {
    name: "Deutsch: QWERTZ",
    language: "de",
    deadKeys: [220, 221],
    NORMAL: {
        "32": " ",
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z",
        "186": "ü",
        "187": "+",
        "188": ",",
        "189": "-",
        "190": ".",
        "191": "#",
        "192": "ö",
        "219": "ß",
        "220": function (prim) {
prim.setDeadKeyState("DEAD1");
},
        "221": function (prim) {
prim.setDeadKeyState("DEAD2");
},
        "222": "ä",
        "226": "<"
    },
    DEAD1NORMAL: {
        "65": "â",
        "69": "ê",
        "73": "î",
        "79": "ô",
        "85": "û",
        "190": "."
    },
    DEAD2NORMAL: {
        "65": "á",
        "69": "é",
        "73": "í",
        "79": "ó",
        "83": "s",
        "85": "ú",
        "89": "ý"
    },
    SHIFT: {
        "32": " ",
        "48": "=",
        "49": "!",
        "50": "\"",
        "51": "§",
        "52": "$",
        "53": "%",
        "54": "&",
        "55": "/",
        "56": "(",
        "57": ")",
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "186": "Ü",
        "187": "*",
        "188": ";",
        "189": "_",
        "190": ":",
        "191": "'",
        "192": "Ö",
        "219": "?",
        "222": "Ä",
        "226": ">"
    },
    CTRLALT: {
        "48": "}",
        "50": "²",
        "51": "³",
        "55": "{",
        "56": "[",
        "57": "]",
        "69": "€",
        "77": "µ",
        "81": "@",
        "187": "~",
        "219": "\\",
        "226": "|"
    },
    CTRLALTSHIFT: {
        "219": "ẞ"
    }
};