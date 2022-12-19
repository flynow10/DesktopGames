export class Color {
  private light: string;
  private dark: string;

  constructor(light: string, dark: string | null = null) {
    if (dark === null) dark = light;
    this.light = Color.parseColorStringToHex(light);
    this.dark = Color.parseColorStringToHex(dark);
  }

  public getColor(): string {
    return false ? this.dark : this.light;
  }

  public getBrightness(): number {
    return Color.getLuminance(this.getColor());
  }

  public getIsBright(): boolean {
    return this.getBrightness() > 0.5;
  }

  public getHex(): string {
    return this.getColor();
  }

  public getRgb(): { r: number; g: number; b: number } {
    return Color.hexToRgb(this.getHex());
  }

  public getHsl(): { h: number; s: number; l: number } {
    var rgb = this.getRgb();
    var r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h = 0,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h, s, l };
  }

  // Static Methods

  public static getContrast(color1: Color, color2: Color): number {
    var l1 = color1.getBrightness();
    var l2 = color2.getBrightness();
    var contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return contrast;
  }

  public static getContrastRatio(color1: Color, color2: Color): number {
    var l1 = color1.getBrightness();
    var l2 = color2.getBrightness();
    var contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return contrast;
  }

  public static getLuminance(color: Color | string): number {
    if (typeof color === "string") {
      color = new Color(color);
    }
    var rgb = color.getRgb();
    var a = [rgb.r, rgb.g, rgb.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  public static parseColorStringToHex(color: string): string {
    if (color.startsWith("#")) {
      return color;
    } else if (color.startsWith("rgb")) {
      return Color.rgbToHex(color);
    } else {
      return "#000";
    }
  }

  public static rgbToHex(rgb: string): string {
    // Choose correct separator
    var sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    var rgbArray = rgb.substring(4).split(")")[0].split(sep);

    var r = (+rgbArray[0]).toString(16),
      g = (+rgbArray[1]).toString(16),
      b = (+rgbArray[2]).toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  public static hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }
}
