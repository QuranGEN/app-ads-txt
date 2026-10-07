(function () {
  'use strict';

  var WebGLCore = {
    createShader: function (gl, type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('Shader compile error: ' + info);
      }
      return shader;
    },

    createProgram: function (gl, vsSource, fsSource) {
      var vs = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
      var fs = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      var program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error('Program link error: ' + info);
      }
      return program;
    },

    createFullscreenQuad: function (gl) {
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
      ]), gl.STATIC_DRAW);
      return buffer;
    },

    getUniforms: function (gl, program, names) {
      var uniforms = {};
      names.forEach(function (name) {
        uniforms[name] = gl.getUniformLocation(program, name);
      });
      return uniforms;
    },

    resizeCanvas: function (canvas, gl) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }
  };

  window.WebGLCore = WebGLCore;
})();
