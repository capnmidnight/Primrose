using System;

namespace Primrose
{
    public class Point
    {
        public int x { get; set; }
        public int y { get; set; }

        public Point(int x, int y)
        {
            set(x, y);
        }

        public void set(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        public void copy(Point p)
        {
            if (p != null)
            {
                set(p.x, p.y);
            }
        }

        public void toCell(Size character, Point scroll, Rectangle gridBounds)
        {
            x = (int)Math.Round((float)x / character.width) + scroll.x - gridBounds.x;
            y = (int)Math.Floor(((float)y / character.height) - 0.25f) + scroll.y;
        }

        public bool inBounds(Rectangle bounds)
        {
            return bounds.left <= x && x < bounds.right
                && bounds.top <= y && y < bounds.bottom;
        }

        public Point clone()
        {
            return new Point(x, y);
        }

        public override string ToString()
        {
            return $"(x:{x}, y:{y})";
        }
    }

    public class Size
    {
        public int width { get; set; }
        public int height { get; set; }

        public Size(int width, int height)
        {
            set(width, height);
            this.width = width;
            this.height = height;
        }

        public void set(int width, int height)
        {
            this.width = width;
            this.height = height;
        }

        public void copy(Size s)
        {
            if (s != null)
            {
                set(s.width, s.height);
            }
        }

        public Size clone()
        {
            return new Size(width, height);
        }

        public override string ToString()
        {
            return $"<w:{width}, h:{height}>";
        }
    };

    public class Rectangle
    {
        public Point point { get; }
        public Size size { get; }

        public Rectangle(int x, int y, int width, int height)
        {
            point = new Point(x, y);
            size = new Size(width, height);
        }

        public int x
        {
            get => point.x;
            set => point.x = value;
        }

        public int left
        {
            get => x;
            set => x = value;
        }

        public int width
        {
            get => size.width;
            set => size.width = value;
        }

        public int right
        {
            get => x + width;
            set => x = value - width;
        }

        public int y
        {
            get => point.y;
            set => point.y = value;
        }

        public int top
        {
            get => y;
            set => y = value;
        }

        public int height
        {
            get => size.height;
            set => size.height = value;
        }

        public int bottom
        {
            get => y + height;
            set => y = value - height;
        }

        public int area
        {
            get => width * height;
        }

        public void set(int x, int y, int width, int height)
        {
            this.point.set(x, y);
            this.size.set(width, height);
        }

        public void copy(Rectangle r)
        {
            if (r != null)
            {
                this.point.copy(r.point);
                this.size.copy(r.size);
            }
        }

        public Rectangle clone()
        {
            return new Rectangle(x, y, width, height);
        }

        public Rectangle overlap(Rectangle r)
        {
            if (r == null)
            {
                throw new ArgumentNullException(nameof(r));
            }

            int left = Math.Max(this.left, r.left),
                top = Math.Max(this.top, r.top),
                right = Math.Min(this.right, r.right),
                bottom = Math.Min(this.bottom, r.bottom);

            if (right > left && bottom > top)
            {
                return new Rectangle(left, top, right - left, bottom - top);
            }
            else
            {
                return null;
            }
        }

        public override string ToString()
        {
            return $"[{this.point} x {this.size}]";
        }
    };

}