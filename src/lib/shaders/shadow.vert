#version 300 es

precision highp float;

// Position attribute
// Represents a position on the geometry
// In the original unit-space
in vec4 a_position;

// World transformation matrix
// One matrix per instance
in mat4 a_worldMatrix;

// Camera projection uniform
uniform mat4 u_projectionMatrix;

// Camera view uniform
uniform mat4 u_viewMatrix;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * a_worldMatrix * a_position;
}
