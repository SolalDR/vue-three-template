#include <common>
uniform sampler2D tColor;
uniform vec2 resolution;
varying vec2 vUv;

// Use these parameters to fiddle with settings
float step = 1.3;

float intensity(in vec4 color){
	return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

float sobel(sampler2D tex, float stepx, float stepy, vec2 center){
	// get samples around pixel
    float tleft = intensity(texture2D(tex,center + vec2(-stepx,stepy)));
    float left = intensity(texture2D(tex,center + vec2(-stepx,0)));
    float bleft = intensity(texture2D(tex,center + vec2(-stepx,-stepy)));
    float top = intensity(texture2D(tex,center + vec2(0,stepy)));
    float bottom = intensity(texture2D(tex,center + vec2(0,-stepy)));
    float tright = intensity(texture2D(tex,center + vec2(stepx,stepy)));
    float right = intensity(texture2D(tex,center + vec2(stepx,0)));
    float bright = intensity(texture2D(tex,center + vec2(stepx,-stepy)));
 
    float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
    float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
    float color = sqrt((x*x) + (y*y));
    return color;
}

void main() {
    float step = .5;
    vec3 blue = vec3(0.06274509803, 0, 0.58431372549);
    float sobel = clamp(sobel(tColor, step/resolution.x, step/resolution.y, vUv)*20. - 1., 0., 1.);
    gl_FragColor = vec4(vec3(sobel) + blue , 1.);
}