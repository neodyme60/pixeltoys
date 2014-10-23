function Engine()
{
	this.gl=null;
	this.fragmentShader;
	this.vertexShader;
	this.shaderProgram;
	this.vertexPositionBuffer;
	this.fxLoaded=false;
	
	//samplers
	this.mSamplers=new Array(null,null,null,null);
		
	//canvas size
	this.viewportHeight;
	this.viewportWidth;
	
	//mouse pos
	this.mouseXpos=0;
	this.mouseYpos=0;
		
	//mouse button state;
	this.isMouseButtonDown=false;
	
	this.vertices = [ -1., -1.,   1., -1.,    -1.,  1.,     1., -1.,    1.,  1.,    -1.,  1.];  
}

Engine.prototype.Init=function()
{
	this.InitGl($("#c")[0]);	
}

Engine.prototype.GetSelectedFx=function()
{
	var e = document.getElementById("shaders_list");
	var id = e.options[e.selectedIndex].value;

	return id;
}

Engine.prototype.InitBuffers=function()	
{
	this.vertexPositionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
}

function CreateGlTexture(texture) 
{
//	gl.enable(gl.TEXTURE_2D);
    myEngine.gl.pixelStorei(myEngine.gl.UNPACK_FLIP_Y_WEBGL, true);
    myEngine.gl.bindTexture(myEngine.gl.TEXTURE_2D, texture);
    myEngine.gl.texImage2D(myEngine.gl.TEXTURE_2D, 0, myEngine.gl.RGBA, myEngine.gl.RGBA, myEngine.gl.UNSIGNED_BYTE, texture.image);
    myEngine.gl.texParameteri(myEngine.gl.TEXTURE_2D, myEngine.gl.TEXTURE_MAG_FILTER, myEngine.gl.LINEAR);
    myEngine.gl.texParameteri(myEngine.gl.TEXTURE_2D, myEngine.gl.TEXTURE_MIN_FILTER, myEngine.gl.LINEAR_MIPMAP_NEAREST);
	myEngine.gl.texParameteri(myEngine.gl.TEXTURE_2D, myEngine.gl.TEXTURE_WRAP_S, myEngine.gl.REPEAT);
    myEngine.gl.texParameteri(myEngine.gl.TEXTURE_2D, myEngine.gl.TEXTURE_WRAP_T, myEngine.gl.REPEAT);	
	myEngine.gl.generateMipmap(myEngine.gl.TEXTURE_2D)
    myEngine.gl.bindTexture(myEngine.gl.TEXTURE_2D, null);
}

Engine.prototype.LoadImageTexture=function(url,callback) 
{
	debugLn("\r\nLoad texture => "+url);

	var texture = this.gl.createTexture();
    texture.image = new Image();
    texture.image.crossOrigin = 'anonymous';
    texture.image.onload = function() 
	{ 
		CreateGlTexture(texture);
	}
    texture.image.src = url;
	
	if(callback) { callback(texture); }
	
    return texture;
}

Engine.prototype.SetTextures=function(samplerIndex, url)	
{
	var tmpTexture = (url=="")?null:this.LoadImageTexture(url,null);

	if( this.mSamplers[samplerIndex]!=null) 
		this.gl.deleteTexture(this.mSamplers[samplerIndex]);
	this.mSamplers[samplerIndex] = tmpTexture;	
}

//
//resize event
//
Engine.prototype.Resize=function(x, y) 
{
	this.viewportWidth=x;
	this.viewportHeight=y;
}

//
// mouse event section
//
Engine.prototype.MouseDown=function() 
{
	this.isMouseButtonDown=true;
}

Engine.prototype.MouseMove=function(x, y) 
{
	if (!this.isMouseButtonDown) return;
	this.mouseXpos=x;
	this.mouseYpos=y;	
}

Engine.prototype.MouseUp=function() 
{
	this.isMouseButtonDown=false;
}

Engine.prototype.InitGl=function(c)
{
		this.gl=null;
		try 
		{
			this.gl = c.getContext("webgl") || c.getContext("experimental-webgl");
			this.InitBuffers();
		} 
		catch(e) 
		{
			if (!this.gl) 
			{
				alert("Unable to initialize WebGL. Your browser may not support it.");
			}
		}		
}

Engine.prototype.InitShaders=function()
{
	debugLn("\r\Init Shader");

	//create a new program
	var tmpProgram = this.gl.createProgram();
	
	//create fragment shader	
    this.fragmentShader = this.getShader(this.gl, document.getElementById("shader-fs").value,"x-shader/x-fragment");
	if (!this.fragmentShader) {  this.gl.deleteProgram( tmpProgram ); return; }

	//create vertex shader	
    this.vertexShader = this.getShader(this.gl, document.getElementById("shader-vs").value,"x-shader/x-vertex");
	if (!this.vertexShader) { this.gl.deleteProgram( tmpProgram ); return; }
	
	//attach shader to program
	this.gl.attachShader(tmpProgram, this.vertexShader);
    this.gl.attachShader(tmpProgram, this.fragmentShader);
	
	this.gl.deleteShader(this.vertexShader);
	this.gl.deleteShader(this.fragmentShader);
	
    this.gl.linkProgram(tmpProgram);

	//check linking	status
    if (!this.gl.getProgramParameter(tmpProgram, this.gl.LINK_STATUS)) 
	{
		debugLn("\r\nCould not initialise shaders");		
		return null;
    }

	//delete previous program if any
	if(this.shaderProgram)
		this.gl.deleteProgram( this.shaderProgram );
	
	this.shaderProgram=tmpProgram;

	return this.shaderProgram;
}

Engine.prototype.Render=function(time)
{
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
/*
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque  
    this.gl.enable(gl.DEPTH_TEST);                               // Enable depth testing  
    this.gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things  
    this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.  
*/
	this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);// | this.gl.DEPTH_BUFFER_BIT);
	
//	this.gl.glShadeModel(this.gl.GL_SMOOTH);
	
	//use our program
	this.gl.useProgram(this.shaderProgram);
	
	//bind attrib
	var attrib=new Array(4);
    attrib[0] = this.gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    attrib[1] = this.gl.getUniformLocation(this.shaderProgram, "time");
	attrib[2] = this.gl.getUniformLocation(this.shaderProgram, "resolution");
    attrib[3] = this.gl.getUniformLocation(this.shaderProgram, "mouse");

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);

	//texture	
    var textures=new Array(4);
	textures[0]=this.gl.getUniformLocation(this.shaderProgram, "tex0");
    textures[1]=this.gl.getUniformLocation(this.shaderProgram, "tex1");
    textures[2]=this.gl.getUniformLocation(this.shaderProgram, "tex2");
    textures[3]=this.gl.getUniformLocation(this.shaderProgram, "tex3");
	
	//bind uniform
	if (attrib[1]) this.gl.uniform1f(attrib[1], time/1000.0);
    if (attrib[2]) this.gl.uniform2f(attrib[2], this.viewportWidth, this.viewportHeight);
    if (attrib[3]) this.gl.uniform4f(attrib[3], this.mouseXpos, this.viewportHeight-1-this.mouseYpos,0.0,0.0);	
				
	//bind shader posisiont attribut
	this.gl.vertexAttribPointer(attrib[0], 2, this.gl.FLOAT, false, 0, 0);
	this.gl.enableVertexAttribArray(attrib[0]);
	
//	this.gl.enable(this.gl.TEXTURE_2D);
	
	for(var i=0;i<4;i++)
		if( textures[i]!=null ) 
		{ 
			this.gl.uniform1i(textures[i], i ); 
			this.gl.activeTexture(this.gl.TEXTURE0+i); 
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.mSamplers[i]);
		}

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	this.gl.disableVertexAttribArray(attrib[0]);
}
	  
Engine.prototype.getShader=function(gl, str, type) 
{
    var shader;
    if (type == "x-shader/x-fragment") 
	{
      shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    } 
	else if (type == "x-shader/x-vertex") 
	{
      shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    } 
	else 
	{
      return null;
    }

    this.gl.shaderSource(shader, str);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) 
	{
		debugLn("\r\n"+this.gl.getShaderInfoLog(shader));		
		return null;
    }
    return shader;
}
