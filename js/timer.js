function Timer(fps_forced)
{
	this.time = null;
	this.delay = 0;
	this.fps = 0;
	this.force_fps = fps_forced;
	this.duration = 0;
	this.start=0;
	this.OnUpdate = function()
	{
		var date = new Date();
		if(this.time==null)
		{
			this.start=date.getTime();
			this.time = this.start;
			this.duration = 1000/this.force_fps-this.delay;
		} 
		else 
		{
			this.delay = (date.getTime())-this.time;
			this.time = date.getTime();
			this.fps = Math.round(1000/this.delay);
			if(this.fps>this.force_fps)
			{
				this.duration = Math.round(2000/this.force_fps)-this.delay;
			} 
			else 
			{
				this.duration = Math.round(1000/this.force_fps);
			}
		}
		if(this.duration<10){ this.duration=10; }
	}
	this.setFPS = function(fps_forced)
	{
		this.force_fps = fps_forced;
	}
	this.ForcedFPS = function()
	{
		return this.force_fps;
	}
	this.FPS = function()
	{
		return this.fps;
	}
	this.GetElapsed=function()
	{
		return new Date().getTime() - this.start;
	}
}