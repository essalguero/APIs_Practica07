varying vec3 N;
varying vec4 vertexObserver;

varying vec2 fTexture;
varying vec2 normalfTexture;

uniform bool isTexturized;
uniform bool hasColor;
uniform sampler2D texSampler;
uniform vec4 color;


uniform sampler2D normalSampler;
uniform sampler2D reflectSampler;
uniform sampler2D refractSampler;

uniform samplerCube cubeSampler;

const int MAX_LIGHTS = 8;

uniform int numberLights;
uniform vec4 diffuse;
uniform int shininess;
uniform vec3 ambientLight;

uniform bool isCubic;

struct LightInfo                                                           
{  
	vec4 lightColor;
	float linearAttenuation;

	vec4 lightVector;
};
uniform LightInfo lights[MAX_LIGHTS];

struct LightComponents
{
	vec4 diffuseComponent;
	vec4 specularComponent;
};


LightComponents calculateLight(int i)
{

	LightComponents currentLight;

	vec4 diffuseComponent = vec4(ambientLight, 1.0);
	vec4 specularComponent = vec4(0.0, 0.0, 0.0, 1.0);
	float NdotL;

	vec3 normalizedN = normalize(N);

	vec3 L = lights[i].lightVector.xyz;

	float attenuationFactor = 1.0;

	if (lights[i].lightVector.w == 1.0)
	{
		L = L - vertexObserver.xyz;
		attenuationFactor = 1.0 / (1.0 + (lights[i].linearAttenuation * length(L)));
	}

	L = normalize(L);
	NdotL = max(dot(normalizedN, L), 0.0);

	diffuseComponent += NdotL * lights[i].lightColor * attenuationFactor;

	if ((shininess > 0) && (NdotL > 0.0))
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm.xyz;
		H = normalize(H);
		
		float NdotH = max(dot(normalizedN, H), 0.0);

		specularComponent += pow(NdotH, float(shininess)) * attenuationFactor;
	}

	currentLight.diffuseComponent = diffuseComponent;
	currentLight.specularComponent = specularComponent;

	return currentLight;
}


void main()
{
	//gl_FragColor = texture2D(normalSampler, normalfTexture); //vec4(normalfTexture.x, normalfTexture.y, 1, 1);
	
	vec4 diffuseComponent = vec4(0, 0, 0, 1);
	vec4 specularComponent = vec4(0, 0, 0, 1);
	LightComponents currentLight; 

	if (isCubic)
	{
		//gl_FragColor = textureCube(cubeSampler, vertexObserver.xyww);
		gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
	}
	else
	{
		if (numberLights > 0)
		{
			vec4 totalIlumination = vec4(0, 0, 0, 1.0);

			for (int i = 0; i < numberLights; ++i)
			{
				currentLight = calculateLight(i);
			
				specularComponent += currentLight.specularComponent;
				diffuseComponent += currentLight.diffuseComponent;
			
			}

			if (hasColor)
			{
				if (isTexturized)
				{
					if (isCubic)
					{
						gl_FragColor = (diffuseComponent * color * textureCube(cubeSampler, N))  + specularComponent;
					}
					else
					{
						gl_FragColor = (diffuseComponent * color * texture2D(texSampler, fTexture)) + specularComponent;
						//gl_FragColor = specularComponent;
						}
				}
				else
				{
					gl_FragColor = (diffuseComponent * color) + specularComponent;
				}
			}
		}
		else
		{
			if (isTexturized)
			{
				if (isCubic)
				{
					gl_FragColor = diffuse * color * textureCube(cubeSampler, N);
				}
				else
				{
					gl_FragColor = diffuse * color * texture2D(texSampler, fTexture) * texture2D(normalSampler, normalfTexture);
					//gl_FragColor = color;
				}
			}
			else
			{
				gl_FragColor = color;
			}
		}
	}
}