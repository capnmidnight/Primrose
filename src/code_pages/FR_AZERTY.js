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
    name: "Français: AZERTY",
    language: "fr",
    deadKeys: [221, 50, 55],
    NORMAL: {
        "48": "à",
        "49": "&",
        "50": "é",
        "51": "\"",
        "52": "'",
        "53": "(",
        "54": "-",
        "55": "è",
        "56": "_",
        "57": "ç",
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
        "186": "$",
        "187": "=",
        "188": ",",
        "190": ";",
        "191": ":",
        "192": "ù",
        "219": ")",
        "220": "*",
        "221": function (prim) {
            prim.setDeadKeyState("DEAD1");
        },
        "222": "²",
        "223": "!",
        "226": "<"
    },
    SHIFT: {
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
        "186": "£",
        "187": "+",
        "188": "?",
        "190": ".",
        "191": "/",
        "192": "%",
        "219": "°",
        "220": "µ",
        "223": "§",
        "226": ">"
    },
    CTRLALT: {
        "48": "@",
        "50": function (prim) {
            prim.setDeadKeyState("DEAD2");
        },
        "51": "#",
        "52": "{",
        "53": "[",
        "54": "|",
        "55": function (prim) {
            prim.setDeadKeyState("DEAD3");
        },
        "56": "\\",
        "57": "^",
        "69": "€",
        "186": "¤",
        "187": "}",
        "219": "]"
    },
    DEAD1NORMAL: {
        "65": "â",
        "69": "ê",
        "73": "î",
        "79": "ô",
        "85": "û"
    },
    DEAD2NORMAL: {
        "65": "ã",
        "78": "ñ",
        "79": "õ"
    },
    DEAD2CTRLALT: {
        "50": function (prim) {
            prim.setDeadKeyState("DEAD2");
        },
        "55": function (prim) {
            prim.setDeadKeyState("DEAD3");
        }
    },
    DEAD1CTRLALT: {
        "50": function (prim) {
            prim.setDeadKeyState("DEAD2");
        }
    },
    DEAD3NORMAL: {
        "48": "à",
        "50": "é",
        "55": "è",
        "65": "à",
        "69": "è",
        "73": "ì",
        "79": "ò",
        "85": "ù"
    }
};