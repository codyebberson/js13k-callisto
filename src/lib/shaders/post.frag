#version 300 es

precision highp float;

uniform sampler2D u_colorTexture;

uniform sampler2D u_bloomTexture;

in vec2 v_texCoord;

out vec4 outputColor;

void main() {
    // Get the bloom shader output
    vec4 bloomColor = texture(u_bloomTexture, v_texCoord);
    vec4 color = texture(u_colorTexture, v_texCoord);
    outputColor = vec4(color.rgb + 2.0 * bloomColor.a * bloomColor.rgb, 1);
}
