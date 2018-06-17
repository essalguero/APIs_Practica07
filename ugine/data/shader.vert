//varying vec3 fcolor;
varying vec3 N;
varying vec4 vertexObserver;
varying vec3 fpos;

attribute vec3 vpos;
attribute vec2 vTexture;
attribute vec2 normalvTexture;
uniform mat4 mvpMatrix;

varying vec2 fTexture;
varying vec2 normalfTexture;

attribute vec3 vnormal;
attribute vec3 vtangent;
uniform mat4 mvMatrix;
uniform mat4 normalsMatrix;

uniform bool isCubemap;
uniform mat4 vpMatrix;

void main() {
	vec4 poss = mvpMatrix * vec4(vpos, 1);
	vec4 tempN = normalsMatrix * vec4(vnormal, 1);
	N = tempN.xyz;

	vertexObserver = mvMatrix * vec4(vpos, 1);
	
	fTexture = vTexture;
	normalfTexture = (normalvTexture * 0.5) + 0.5;

	if (isCubemap)
	{
		poss = vpMatrix * vec4(vpos, 1);
		poss = vec4(poss.x, poss.y, poss.w, poss.w);
		poss = poss.xyww;

		fpos = vpos;
	}

	gl_Position = poss;
}