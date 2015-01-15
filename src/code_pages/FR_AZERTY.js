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



CodePages.FR_AZERTY = {
    name: "FR_AZERTY",
    language: "fr",
    CTRLALT: {
        "50": function (prim, lines, cursor) {
            prim.setState("DEAD3");
        },
        "55": function (prim, lines, cursor) {
            prim.setState("DEAD4");
        },
        "51": "#",
        "52": "{",
        "53": "[",
        "54": "|",
        "56": "\\",
        "57": "^",
        "48": "@",
        "219": "]",
        "187": "}",
        "69": "€",
        "186": "¤"
    },
    DEAD1NORMAL: {
        "221": "^^",
        "65": "â",
        "69": "ê",
        "82": "r",
        "84": "t",
        "85": "û",
        "73": "î",
        "79": "ô",
        "72": "h",
        "66": "b"
    },
    DEAD2SHIFT: {
        "221": "¨¨",
        "79": "O",
        "73": "Ï",
        "85": "Ü",
        "69": "Ë",
        "65": "Ä"
    },
    DEAD3CTRLALT: {
        "50": "~~"
    },
    DEAD3NORMAL: {
        "65": "ã",
        "79": "õ",
        "78": "ñ"
    },
    DEAD4CTRLALT: {
        "55": "``"
    },
    DEAD4NORMAL: {
        "65": "à",
        "69": "è",
        "85": "ù",
        "73": "ì",
        "79": "ò"
    },
    NORMAL: {
        "221": function (prim, lines, cursor) {
            prim.setState("DEAD1");
        },
        "222": "²",
        "49": "&",
        "50": "é",
        "51": "\"",
        "52": "'",
        "53": "(",
        "54": "-",
        "55": "è",
        "56": "_",
        "57": "ç",
        "48": "à",
        "219": ")",
        "187": "=",
        "65": "a",
        "90": "z",
        "69": "e",
        "82": "r",
        "84": "t",
        "89": "y",
        "85": "u",
        "73": "i",
        "79": "o",
        "80": "p",
        "186": "$",
        "81": "q",
        "83": "s",
        "68": "d",
        "70": "f",
        "71": "g",
        "72": "h",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "192": "ù",
        "220": "*",
        "226": "<",
        "87": "w",
        "88": "x",
        "67": "c",
        "86": "v",
        "66": "b",
        "78": "n",
        "188": ",",
        "190": ";",
        "191": ":",
        "223": "!"
    },
    SHIFT: {
        "221": function (prim, lines, cursor) {
            prim.setState("DEAD2");
        },
        "222": "",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "48": "0",
        "219": "°",
        "187": "+",
        "65": "A",
        "90": "Z",
        "69": "E",
        "82": "R",
        "84": "T",
        "89": "Y",
        "85": "U",
        "73": "I",
        "79": "O",
        "80": "P",
        "186": "£",
        "81": "Q",
        "83": "S",
        "68": "D",
        "70": "F",
        "71": "G",
        "72": "H",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "192": "%",
        "220": "µ",
        "226": ">",
        "87": "W",
        "88": "X",
        "67": "C",
        "86": "V",
        "66": "B",
        "78": "N",
        "188": "?",
        "190": ".",
        "191": "/",
        "223": "§"
    }
};