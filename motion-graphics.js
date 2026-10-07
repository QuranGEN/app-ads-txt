(function () {
  'use strict';

  function MotionGraphics(canvas, theme) {
    this.canvas = canvas;
    this.theme = theme || 'studio';
    this.gl = canvas.getContext('webgl', { alpha: false, antialias: false }) ||
              canvas.getContext('experimental-webgl', { alpha: false, antialias: false });
    this.program = null;
    this.uniforms = null;
    this.buffer = null;
    this.raf = null;
    this.startTime = performance.now();
    this.mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    this.scroll = 0;
    this.running = false;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.gl) return;
    this.init();
  }

  MotionGraphics.prototype.init = function () {
    var gl = this.gl;
    var fragSource = window.Shaders[this.theme] || window.Shaders.studio;
    this.program = window.WebGLCore.createProgram(gl, window.Shaders.vertex, fragSource);
    gl.useProgram(this.program);
    this.buffer = window.WebGLCore.createFullscreenQuad(gl);
    this.uniforms = window.WebGLCore.getUniforms(gl, this.program, [
      'u_time', 'u_resolution', 'u_mouse', 'u_scroll'
    ]);
    var posLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    this.resize();
    this.bindEvents();
    if (!this.reduceMotion) {
      this.start();
    } else {
      this.render(0);
    }
  };

  MotionGraphics.prototype.resize = function () {
    if (!this.gl) return;
    window.WebGLCore.resizeCanvas(this.canvas, this.gl);
  };

  MotionGraphics.prototype.bindEvents = function () {
    var self = this;
    window.addEventListener('resize', function () { self.resize(); });
    document.addEventListener('mousemove', function (e) {
      self.mouse.tx = e.clientX / window.innerWidth;
      self.mouse.ty = 1.0 - e.clientY / window.innerHeight;
    }, { passive: true });
    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      self.scroll = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        self.stop();
      } else if (!self.reduceMotion) {
        self.start();
      }
    });
  };

  MotionGraphics.prototype.start = function () {
    if (this.running || !this.gl) return;
    this.running = true;
    var self = this;
    var loop = function () {
      if (!self.running) return;
      var time = (performance.now() - self.startTime) / 1000;
      self.render(time);
      self.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  };

  MotionGraphics.prototype.stop = function () {
    this.running = false;
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  };

  MotionGraphics.prototype.render = function (time) {
    var gl = this.gl;
    if (!gl || !this.program) return;
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;
    gl.uniform1f(this.uniforms.u_time, time);
    gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.u_mouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.uniforms.u_scroll, this.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  MotionGraphics.prototype.destroy = function () {
    this.stop();
    if (this.gl) {
      var ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
  };

  window.MotionGraphics = MotionGraphics;
})();
