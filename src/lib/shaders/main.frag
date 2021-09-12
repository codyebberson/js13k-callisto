#version 300 es

precision highp float;

// The color texture
uniform sampler2D u_colorTexture;

// The shadow map texture
uniform sampler2D u_depthTexture;

// Lighting details
// Light zero is the special light, used with shadow maps
uniform vec3 u_lightPositions[16];
uniform vec3 u_lightColors[16];

// Color varying
// Simple copy of the input color
in vec4 v_color;

// Fog distance
in float v_fogDistance;

// World position
// Mesh position transformed to world position
in vec4 v_position;

// The shadow map texture coordinate
in vec4 v_shadowMapTexCoord;

// Output color
out vec4 outputColor;

void main() {

    // Emissive
    if (v_color.r > 0.99 || v_color.g > 0.99 || v_color.b > 0.99) {
        outputColor = v_color;
        return;
    }

    // Skybox
    // Based on: https://github.com/carlini/js13k2020-yet-another-space-shooter/blob/master/src/graphics.js#L216-L228
    if (v_color.r < 0.1 && v_color.g < 0.1 && v_color.b < 0.1) {
      vec3 cody_p = normalize(normalize((-v_position).xyz)-.5);
      float cody_pa, cody_a=cody_pa= 0.;
      for (int cody_i=0; cody_i<15; cody_i += 1) {
        cody_p=abs(cody_p)/dot(cody_p,cody_p)-.49;
        cody_a+=abs(length(cody_p)-cody_pa);
        cody_pa=length(cody_p);
      }
      cody_a *= cody_a*cody_a;
      vec3 cody_s = pow(vec3(cody_a/2e5, cody_a/2e5, cody_a/1e5), vec3(.9));
      outputColor.rgb = .5 * clamp(cody_s,0.,2.) + vec3(0.03, 0.0, 0.12);
      outputColor.a = 1.0;
      return;
    }

    // The majority of this shader is calculating light.
    // There are 4 inputs to lighting:
    // 1) Ambient - permeates the scene, not affected by direction
    // 2) Directional - light emmitted from the light source
    // 3) Specular refleciton - light bouncing directly into the camera
    //    See: http://learnwebgl.brown37.net/09_lights/lights_specular.html
    // 4) Shadows
    //    See: https://webgl2fundamentals.org/webgl/lessons/webgl-shadows.html

    // First we need to calculate the surface normal
    // We use the fragment deltas to infer the normal
    // This is a pretty GPU-inefficient way to do it,
    // but it's a small amount of code
    vec3 surfaceNormal = normalize(cross(dFdx(v_position.xyz), dFdy(v_position.xyz)));

    // Directional light
    vec3 lightNormal = vec3(-.25, -.75, .2);
    float directionalLight = max(dot(surfaceNormal, lightNormal), 0.0);

    // Specular light
    vec3 reflectionNormal = lightNormal - 2.0 * dot(lightNormal, surfaceNormal) * surfaceNormal;
    // vec3 cameraNormal = normalize(vec3(1, 0, -1));
    // vec3 cameraNormal = normalize(vec3(-1, 0, 1));
    vec3 cameraNormal = normalize(vec3(0, 0, 1));
    float shininess = 20.0;
    // float specular = pow(clamp(dot(reflectionNormal, cameraNormal), 0.0, 1.0), shininess);
    float specular = 0.0;

    // Shadow mapping
    // Project this fragment onto the shadow map
    vec3 projectedTexcoord = v_shadowMapTexCoord.xyz / v_shadowMapTexCoord.w;

    // The current depth (from the perspective of the light source)
    // is simply the z value of the projected coordinate.
    // Subtract a small "bias" to reduce "shadow acne"
    // float bias = 0.0000003;
    // float currentDepth = projectedTexcoord.z - bias;
    float currentDepth = projectedTexcoord.z * 0.99999965;

    // Make sure the projected coordinate is actually within range of the shadow map
    bool inRange =
        projectedTexcoord.x >= 0.0 &&
        projectedTexcoord.x <= 1.0 &&
        projectedTexcoord.y >= 0.0 &&
        projectedTexcoord.y <= 1.0;
    float projectedCount = 0.0;
    float closerCount = 0.0;

    for (float projectedY = -3.0; projectedY <= 3.0; projectedY += 1.0) {
        for (float projectedX = -3.0; projectedX <= 3.0; projectedX += 1.0) {
            // Get the projected depth
            // (If out of range, this willy simply clamp to edge)
            vec4 projectedPixel = texture(u_depthTexture, projectedTexcoord.xy + vec2(projectedX, projectedY) / 2048.0);
            float projectedDepth = projectedPixel.r;
            if (projectedDepth <= currentDepth) {
                closerCount += 1.0;
            }
            projectedCount += 1.0;
        }
    }

    // And now we can determine if we're in a shadow or not
    // If in a shadow, the shadow light is zero
    // Otherwise, the shadow light is one
    // float shadowLight = (inRange && projectedDepth <= currentDepth) ? 0.2 : 1.0;
    float shadowLight = inRange ? 1.0 - 0.5 * closerCount / projectedCount : 1.0;

    // Now sum up all of the component light sources
    // Total light should be in the range of 0.0 to 1.0
    float totalLight = 0.5 + 0.5 * directionalLight * shadowLight;

    // Light factor can be in the range of 0.0 to 2.0
    // Apply toon shading / cel shading effect
    float lightFactor = clamp(totalLight + shadowLight * specular, 0.0, 1.0);

    // Toon shading
    // lightFactor = 0.25 * round(4.0 * lightFactor);

    // Now map the light factor to a color
    // Light factor 0-1 is black to color
    vec3 surfaceColor = mix(vec3(0.0, 0.1, 0.4), v_color.rgb, lightFactor);

    // Add additional lights
    for (int light = 0; light < 16; light++) {
        vec3 lightRay = v_position.xyz - u_lightPositions[light];
        float lightDistance = length(lightRay);
        float lightRadius = 2.0;
        float lightAttenuation = clamp(lightRadius / (lightDistance * lightDistance), 0.0, 1.0);
        surfaceColor.rgb += 0.2 * max(0.0, dot(normalize(lightRay), surfaceNormal)) * lightAttenuation * u_lightColors[light];
    }

    outputColor.rgb = surfaceColor.rgb;
    outputColor.a = 1.0;
}
