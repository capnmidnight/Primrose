// Various flags used for feature detecting and configuring the system
namespace Primrose
{
    public static class Flags
    {
        public static bool isApple
        {
            get
            {
                return System.Environment.OSVersion.Platform == System.PlatformID.MacOSX;
            }
        }
    }
}