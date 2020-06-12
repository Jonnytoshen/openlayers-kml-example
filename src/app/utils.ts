import Feature from 'ol/Feature';
import { isArray, isNullOrUndefined } from 'util';
import { Style, Fill, Icon, Stroke, Text } from 'ol/style';

export function defaultValueExclusion(value: any, defaultValue: any): undefined|any {
    if (isArray(value) && isArray(defaultValue) && value.length === defaultValue.length) {
        return value.find((item, index) => defaultValue[index] !== item) ? undefined : value;
    } else {
        return value === defaultValue ? undefined : value;
    }
}

export function getFeatureStyle(feature: Feature, resolution: number): object[] {
    const styleFunction = feature.getStyleFunction();
    const style = styleFunction(feature, resolution);
    const styles = isArray(style) ? [ ...style ] : [ style ];

    const stylesJSON = styles.map(s => writeStyle(s));
    return stylesJSON;
}

export function writeStyleFill(fill: Fill): object|undefined {
    if (fill instanceof Fill) {
        const result = {};
        result['color'] = fill.getColor();
        return result;
    } else {
        return undefined;
    }
}

export function writeStyleIcon(image: Icon): object|undefined {
    if (image instanceof Icon) {
        const result = {};
        result['anchor'] = defaultValueExclusion(image.getAnchor(), [0.5, 0.5]);
        result['anchorOrigin'] = defaultValueExclusion(image['anchorOrigin_'], 'top-left');
        result['anchorXUnits'] = defaultValueExclusion(image['anchorXUnits_'], 'fraction');
        result['anchorYUnits'] = defaultValueExclusion(image['anchorYUnits_'], 'fraction');
        result['color'] = image.getColor();
        result['crossOrigin'] = image['crossOrigin'];
        result['img'] = image.getImage();
        result['offset'] = defaultValueExclusion(image['offset_'], [0, 0]);
        result['displacement'] = defaultValueExclusion(image.getDisplacement(), [0, 0]);
        result['offsetOrigin'] = defaultValueExclusion(image['offsetOrigin_'], 'top-left');
        result['opacity'] = image.getOpacity();
        result['scale'] = image.getScale();
        result['rotateWithView'] = image.getRotateWithView();
        result['rotation'] = image.getRotation();
        result['size'] = image.getSize();
        result['imgSize'] = image.getImageSize();
        result['src'] = image.getSrc();
        return result;
    } else {
        return undefined;
    }
}

export function writeStyleStroke(stroke: Stroke): object|undefined {
    if (stroke instanceof Stroke) {
        const result = {};
        result['color'] = stroke.getColor();
        result['lineCap'] = defaultValueExclusion(stroke.getLineCap(), 'round');
        result['lineJoin'] = defaultValueExclusion(stroke.getLineJoin(), 'round');
        result['lineDash'] = stroke.getLineDash();
        result['lineDashOffset'] = defaultValueExclusion(stroke.getLineDashOffset(), 0);
        result['miterLimit'] = defaultValueExclusion(stroke.getMiterLimit(), 10);
        result['width'] = stroke.getWidth();
        return result;
    } else {
        return undefined;
    }
}

export function writeStyleText(text: Text): object|undefined {
    if (text instanceof Text && !isNullOrUndefined(text.getText())) {
        const result = {};
        result['font'] = text.getFont();
        result['maxAngle'] = defaultValueExclusion(text.getMaxAngle(), Math.PI/4);
        result['offsetX'] = defaultValueExclusion(text.getOffsetX(), 0);
        result['offsetY'] = defaultValueExclusion(text.getOffsetY(), 0);
        result['overflow'] = defaultValueExclusion(text.getOverflow(), false);
        result['placement'] = defaultValueExclusion(text.getPlacement(), 'point');
        result['scale'] = text.getScale();
        result['rotateWithView'] = defaultValueExclusion(text.getRotateWithView(), false);
        result['rotation'] = defaultValueExclusion(text.getRotation(), 0);
        result['text'] = text.getText();
        result['textAlign'] = text.getTextAlign();
        result['textBaseline'] = defaultValueExclusion(text.getTextBaseline(), 'middle');
        result['padding'] = defaultValueExclusion(text.getPadding(), [0, 0, 0, 0]);
        result['fill'] = writeStyleFill(text.getFill());
        result['stroke'] = writeStyleFill(text.getStroke());
        result['backgroundFill'] = writeStyleFill(text.getBackgroundFill());
        result['backgroundStroke'] = writeStyleFill(text.getBackgroundStroke());
        return result;
    } else {
        return undefined;
    }
}

export function writeStyle(style: Style): object|undefined {
    const fill = style.getFill();
    const image = style.getImage();
    const stroke = style.getStroke();
    const text = style.getText();
    const zIndex = style.getZIndex();
    const result = {};
    result['fill'] = writeStyleFill(fill);
    result['icon'] = writeStyleIcon(image);
    result['stroke'] = writeStyleStroke(stroke);
    result['text'] = writeStyleText(text);
    result['zIndex'] = zIndex;
    return result;
}