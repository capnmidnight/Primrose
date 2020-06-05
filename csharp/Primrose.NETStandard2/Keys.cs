using System.Collections.Generic;
using System.Linq;

namespace Primrose
{
    public static class Keys
    {
        // These values are defined here:
        //   https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
        //   Values read on May 24, 2020
        private static readonly Dictionary<string, string[]> keyGroups = new Dictionary<string, string[]>() {

            { "special", new string[] {
                "Unidentified"
            } },


            { "modifier", new string[] {
                "Alt",
                "AltGraph",
                "CapsLock",
                "Control",
                "Fn",
                "FnLock",
                "Hyper",
                "Meta",
                "NumLock",
                "ScrollLock",
                "Shift",
                "Super",
                "Symbol",
                "SymbolLock"
            } },


            { "whitespace", new string[] {
                "Enter",
                "Tab"
            } },


            { "navigation", new string[] {
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "End",
                "Home",
                "PageDown",
                "PageUp"
            } },


            { "editing", new string[] {
                "Backspace",
                "Clear",
                "Copy",
                "CrSel",
                "Cut",
                "Delete",
                "EraseEof",
                "ExSel",
                "Insert",
                "Paste",
                "Redo",
                "Undo"
            } },


            { "ui", new string[] {
                "Accept",
                "Again",
                "Attn",
                "Cancel",
                "ContextMenu",
                "Escape",
                "Execute",
                "Find",
                "Finish",
                "Help",
                "Pause",
                "Play",
                "Props",
                "Select",
                "ZoomIn",
                "ZoomOut"
            } },


            { "device", new string[] {
                "BrightnessDown",
                "BrightnessUp",
                "Eject",
                "LogOff",
                "Power",
                "PowerOff",
                "PrintScreen",
                "Hibernate",
                "Standby",
                "WakeUp"
            } },


            { "ime", new string[] {
                "AllCandidates",
                "Alphanumeric",
                "CodeInput",
                "Compose",
                "Convert",
                "Dead",
                "FinalMode",
                "GroupFirst",
                "GroupNext",
                "GroupPrevious",
                "ModeChange",
                "NextCandidate",
                "NonConvert",
                "PreviousCandidate",
                "Process",
                "SingleCandidate"
            } },


            { "korean", new string[] {
                "HangulMode",
                "HanjaMode",
                "JunjaMode"
            } },


            { "japanese", new string[] {
                "Eisu",
                "Hankaku",
                "Hiragana",
                "HiraganaKatakana",
                "KanaMode",
                "KanjiMode",
                "Katakana",
                "Romaji",
                "Zenkaku",
                "ZenkakuHanaku"
            } },


            { "function", new string[] {
                "F1",
                "F2",
                "F3",
                "F4",
                "F5",
                "F6",
                "F7",
                "F8",
                "F9",
                "F10",
                "F11",
                "F12",
                "F13",
                "F14",
                "F15",
                "F16",
                "F17",
                "F18",
                "F19",
                "F20",
                "Soft1",
                "Soft2",
                "Soft3",
                "Soft4"
            } },


            { "phone", new string[] {
                "AppSwitch",
                "Call",
                "Camera",
                "CameraFocus",
                "EndCall",
                "GoBack",
                "GoHome",
                "HeadsetHook",
                "LastNumberRedial",
                "Notification",
                "MannerMode",
                "VoiceDial"
            } },


            { "multimedia", new string[] {
                "ChannelDown",
                "ChannelUp",
                "MediaFastForward",
                "MediaPause",
                "MediaPlay",
                "MediaPlayPause",
                "MediaRecord",
                "MediaRewind",
                "MediaStop",
                "MediaTrackNext",
                "MediaTrackPrevious"
            } },


            { "audio", new string[] {
                "AudioBalanceLeft",
                "AudioBalanceRight",
                "AudioBassDown",
                "AudioBassBoostDown",
                "AudioBassBoostToggle",
                "AudioBassBoostUp",
                "AudioBassUp",
                "AudioFaderFront",
                "AudioFaderRear",
                "AudioSurroundModeNext",
                "AudioTrebleDown",
                "AudioTrebleUp",
                "AudioVolumeDown",
                "AudioVolumeMute",
                "AudioVolumeUp",
                "MicrophoneToggle",
                "MicrophoneVolumeDown",
                "MicrophoneVolumeMute",
                "MicrophoneVolumeUp"
            } },


            { "tv", new string[] {
                "TV",
                "TV3DMode",
                "TVAntennaCable",
                "TVAudioDescription",
                "TVAudioDescriptionMixDown",
                "TVAudioDescriptionMixUp",
                "TVContentsMenu",
                "TVDataService",
                "TVInput",
                "TVInputComponent1",
                "TVInputComponent2",
                "TVInputComposite1",
                "TVInputComposite2",
                "TVInputHDMI1",
                "TVInputHDMI2",
                "TVInputHDMI3",
                "TVInputHDMI4",
                "TVInputVGA1",
                "TVMediaContext",
                "TVNetwork",
                "TVNumberEntry",
                "TVPower",
                "TVRadioService",
                "TVSatellite",
                "TVSatelliteBS",
                "TVSatelliteCS",
                "TVSatelliteToggle",
                "TVTerrestrialAnalog",
                "TVTerrestrialDigital",
                "TVTimer"
            } },


            { "mediaController", new string[] {
                "AVRInput",
                "AVRPower",
                "ColorF0Red",
                "ColorF1Green",
                "ColorF2Yellow",
                "ColorF3Blue",
                "ColorF4Grey",
                "ColorF5Brown",
                "ClosedCaptionToggle",
                "Dimmer",
                "DisplaySwap",
                "DVR",
                "Exit",
                "FavoriteClear0",
                "FavoriteClear1",
                "FavoriteClear2",
                "FavoriteClear3",
                "FavoriteRecall0",
                "FavoriteRecall1",
                "FavoriteRecall2",
                "FavoriteRecall3",
                "FavoriteStore0",
                "FavoriteStore1",
                "FavoriteStore2",
                "FavoriteStore3",
                "Guide",
                "GuideNextDay",
                "GuidePreviousDay",
                "Info",
                "InstantReplay",
                "Link",
                "ListProgram",
                "LiveContent",
                "Lock",
                "MediaApps",
                "MediaAudioTrack",
                "MediaLast",
                "MediaSkipBackward",
                "MediaSkipForward",
                "MediaStepBackward",
                "MediaStepForward",
                "MediaTopMenu",
                "NavigateIn",
                "NavigateNext",
                "NavigateOut",
                "NavigatePrevious",
                "NextFavoriteChannel",
                "NextUserProfile",
                "OnDemand",
                "Pairing",
                "PinPDown",
                "PinPMove",
                "PinPToggle",
                "PinPUp",
                "PlaySpeedDown",
                "PlaySpeedReset",
                "PlaySpeedUp",
                "RandomToggle",
                "RcLowBattery",
                "RecordSpeedNext",
                "RfBypass",
                "ScanChannelsToggle",
                "ScreenModeNext",
                "Settings",
                "SplitScreenToggle",
                "STBInput",
                "STBPower",
                "Subtitle",
                "Teletext",
                "VideoModeNext",
                "Wink",
                "ZoomToggle"
            } },


            { "speechRecognition", new string[] {
                "SpeechCorrectionList",
                "SpeechInputToggle"
            } },


            { "document", new string[] {
                "Close",
                "New",
                "Open",
                "Print",
                "Save",
                "SpellCheck",
                "MailForward",
                "MailReply",
                "MailSend"
            } },


            { "applicationSelector", new string[] {
                "LaunchCalculator",
                "LaunchCalendar",
                "LaunchContacts",
                "LaunchMail",
                "LaunchMediaPlayer",
                "LaunchMusicPlayer",
                "LaunchMyComputer",
                "LaunchPhone",
                "LaunchScreenSaver",
                "LaunchSpreadsheet",
                "LaunchWebBrowser",
                "LaunchWebCam",
                "LaunchWordProcessor",
                "LaunchApplication1",
                "LaunchApplication2",
                "LaunchApplication3",
                "LaunchApplication4",
                "LaunchApplication5",
                "LaunchApplication6",
                "LaunchApplication7",
                "LaunchApplication8",
                "LaunchApplication9"
            } },


            { "browserControl", new string[] {
                "BrowserBack",
                "BrowserFavorites",
                "BrowserForward",
                "BrowserHome",
                "BrowserRefresh",
                "BrowserSearch",
                "BrowserStop"
            } },


            { "numericKeypad", new string[] {
                "Clear"
            } }
        };

        public static readonly Dictionary<string, string> keyTypes = keyGroups
            .SelectMany(
                kv => kv.Value,
                (kv, v) => new { v, k = kv.Key })
            .ToDictionary(t => t.v, t => t.k);


        public static string normalizeKeyValue(object evt)
        {
            // modifier
            if (evt.key == "OS"
                && (evt.code == "OSLeft"
                    || evt.code == "OSRight"))
            {
                return "Meta";
            }
            else if (evt.key == "Scroll")
            {
                return "ScrollLock";
            }
            else if (evt.key == "Win")
            {
                return "Meta";
            }
            // whitespace
            else if (evt.key == "Spacebar")
            {
                return " ";
            }
            else if (evt.key == "\n")
            {
                return "Enter";
            }
            // navigation
            else if (evt.key == "Down")
            {
                return "ArrowDown";
            }
            else if (evt.key == "Left")
            {
                return "ArrowLeft";
            }
            else if (evt.key == "Right")
            {
                return "ArrowRight";
            }
            else if (evt.key == "Up")
            {
                return "ArrowUp";
            }
            // editing
            else if (evt.key == "Del")
            {
                return "Delete";
            }
            else if (evt.key == "Delete"
                && Flags.isApple
                && isFnDown)
            {
                return "Backspace";
            }
            else if (evt.key == "Crsel")
            {
                return "CrSel";
            }
            else if (evt.key == "Exsel")
            {
                return "ExSel";
            }
            // ui
            else if (evt.key == "Esc")
            {
                return "Escape";
            }
            else if (evt.key == "Apps")
            {
                return "ContextMenu";
            }
            // device - None
            // ime
            else if (evt.key == "Multi")
            {
                return "Compose";
            }
            else if (evt.key == "Nonconvert")
            {
                return "NonConvert";
            }
            // korean - None
            // japanese
            else if (evt.key == "RomanCharacters")
            {
                return "Eisu";
            }
            else if (evt.key == "HalfWidth")
            {
                return "Hankaku";
            }
            else if (evt.key == "FullWidth")
            {
                return "Zenkaku";
            }
            // dead - None
            // function - None
            // phone
            else if (evt.key == "Exit"
                || evt.key == "MozHomeScreen")
            {
                return "GoHome";
            }
            // multimedia
            else if (evt.key == "MediaNextTrack")
            {
                return "MediaTrackNext";
            }
            else if (evt.key == "MediaPreviousTrack")
            {
                return "MediaTrackPrevious";
            }
            else if (evt.key == "FastFwd")
            {
                return "MedaiFastFwd";
            }
            // audio
            else if (evt.key == "VolumeDown")
            {
                return "AudioVolumeDown";
            }
            else if (evt.key == "VolumeMute")
            {
                return "AudioVolumeMute";
            }
            else if (evt.key == "VolumeUp")
            {
                return "AudioVolumeUp";
            }
            // TV
            else if (evt.key == "Live")
            {
                return "TV";
            }
            // media
            else if (evt.key == "Zoom")
            {
                return "ZoomToggle";
            }
            // speech recognition - None
            // document - None
            // application selector
            else if (evt.key == "SelectMedia"
                || evt.key == "MediaSelect")
            {
                return "LaunchMediaPlayer";
            }
            // browser - None
            // numeric keypad
            else if (evt.key == "Add")
            {
                return "+";
            }
            else if (evt.key == "Divide")
            {
                return "/";
            }
            else if (evt.key == "Decimal")
            {
                // this is incorrect for some locales, but
                // this is a deprecated value that is fixed in
                // modern browsers, so it shouldn't come up
                // very often.
                return ".";
            }
            else if (evt.key == "Key11")
            {
                return "11";
            }
            else if (evt.key == "Key12")
            {
                return "12";
            }
            else if (evt.key == "Multiply")
            {
                return "*";
            }
            else if (evt.key == "Subtract")
            {
                return "-";
            }
            else if (evt.key == "Separator")
            {
                // this is incorrect for some locales, but 
                // this is a deprecated value that is fixed in
                // modern browsers, so it shouldn't come up
                // very often.
                return ",";
            }
            return evt.key;
        }
    }
}