(function(){
  function start(){
  var header = document.querySelector('.fixed-header');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 10) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  var preloader = document.getElementById('preloader');
  if(preloader){
    preloader.addEventListener('animationend', function(){
      preloader.remove();
    });
  }

  var links = document.querySelectorAll('nav a.nav-link');
  var path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });

  var section = document.querySelector('.hero-section') || document.querySelector('.pro-hero');
  var canvas = document.getElementById('hero-particles');
  if(section && canvas){
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, px = 0, py = 0, particles = [], mx = 0, my = 0, mouseOn = false, tx = 0, ty = 0, tpx = 0, tpy = 0;
    function rnd(min,max){return Math.random()*(max-min)+min}
    function resize(){
      var rect = section.getBoundingClientRect();
      w = canvas.width = Math.floor(rect.width);
      h = canvas.height = Math.floor(rect.height);
    }
    function init(){
      var count = 321;
      particles = [];
      for(var i=0;i<count;i++){
        var layer = i%2===0?0.4:1;
        var r = rnd(1.2,3.2);
        particles.push({
          x: rnd(0,w),
          y: rnd(0,h),
          hx: 0, hy: 0,
          r: r,
          a: rnd(0.5,0.9),
          vx: rnd(-0.15,0.15)*layer,
          vy: rnd(-0.15,0.15)*layer,
          seed: rnd(0, 6.283185307179586),
          tint: 'rgba(167,77,255,',
          stickUntil: 0
        });
        var p = particles[particles.length-1];
        p.hx = p.x; p.hy = p.y;
      }
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      px += (tpx - px) * 0.08;
      py += (tpy - py) * 0.08;
      mx += (tx - mx) * 0.1;
      my += (ty - my) * 0.1;
      var pos = new Array(particles.length);
      for(var i=0;i<particles.length;i++){
        var p = particles[i];
        p.vx *= 0.995;
        p.vy *= 0.995;
        var t = performance.now();
        var fx = Math.cos(p.seed + t*0.00006) * 0.001;
        var fy = Math.sin(p.seed + t*0.00005) * 0.001;
        p.vx += fx;
        p.vy += fy;
        if(mouseOn){
          var dx = mx - p.x;
          var dy = my - p.y;
          var d = Math.hypot(dx, dy);
          var Rstick = 24;
          var R = 160;
          if(d < Rstick){
            p.stickUntil = t + 140;
          }
          if(p.stickUntil > t){
            p.vx += dx * 0.018;
            p.vy += dy * 0.018;
          } else if(d < R && d > 0){
            var k = 1 - d/R;
            var c = k*k * 0.0035;
            p.vx += dx * c;
            p.vy += dy * c;
          }
        }
        p.vx += (p.hx - p.x) * 0.0009;
        p.vy += (p.hy - p.y) * 0.0009;
        var s = Math.hypot(p.vx, p.vy);
        if(s > 0.60){ p.vx = p.vx/s*0.60; p.vy = p.vy/s*0.60; }
        p.x += p.vx;
        p.y += p.vy;
        if(p.x<-5) p.x = w+5;
        if(p.x>w+5) p.x = -5;
        if(p.y<-5) p.y = h+5;
        if(p.y>h+5) p.y = -5;
        var ox = px*(p.r*0.6);
        var oy = py*(p.r*0.6);
        pos[i] = {x: p.x+ox, y: p.y+oy};
      }
      ctx.globalCompositeOperation='source-over';
      ctx.lineWidth = 0.3;
      for(var i=0;i<pos.length;i++){
        for(var j=i+1;j<pos.length;j++){
          var dx = pos[i].x - pos[j].x;
          var dy = pos[i].y - pos[j].y;
          var d = Math.hypot(dx, dy);
          if(d < 55){
            var a = Math.max(0, 0.08 * (1 - d/55));
            ctx.strokeStyle = 'rgba(217,179,255,' + a + ')';
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            ctx.lineTo(pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalCompositeOperation='lighter';
      for(var i=0;i<particles.length;i++){
        var p = particles[i];
        var gx = pos[i].x;
        var gy = pos[i].y;
        var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, p.r*1.5);
        g.addColorStop(0, p.tint + p.a + ')');
        g.addColorStop(1, p.tint + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(gx, gy, p.r*3, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }
    resize();
    init();
    requestAnimationFrame(step);
    var t;
    window.addEventListener('resize', function(){
      clearTimeout(t);
      t = setTimeout(function(){resize(); init();}, 150);
    });
    section.addEventListener('mousemove', function(e){
      var rect = section.getBoundingClientRect();
      var nx = (e.clientX - rect.left)/rect.width - 0.5;
      var ny = (e.clientY - rect.top)/rect.height - 0.5;
      tpx = nx*2;
      tpy = ny*2;
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      mouseOn = true;
    });
    section.addEventListener('mouseleave', function(){
      mouseOn = false;
      tpx = 0; tpy = 0;
    });
  }
  var contactForm = document.querySelector('.contact-form');
  if(contactForm){
    var success = document.getElementById('contact-success');
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = contactForm.querySelector('#name');
      var email = contactForm.querySelector('#email');
      var message = contactForm.querySelector('#message');
      var ok = name && email && message && name.value.trim() && email.value.trim() && message.value.trim();
      if(success){
        success.style.display = 'block';
        success.style.animation = 'fadeInUp 0.5s ease-out';
        success.textContent = ok ? 'Message sent – I will reply soon.' : 'Please fill in all fields.';
        success.style.color = ok ? '#9f9' : '#f88';
      }
      if(ok){ contactForm.reset(); }
    });
  }
  var galleries = document.querySelectorAll('.shots-scroller');
  galleries.forEach(function(scroller){
    var parent = scroller.parentElement;
    var prev = parent.querySelector('.shots-prev');
    var next = parent.querySelector('.shots-next');
    var img = scroller.querySelector('.shots-img');
    var step = (img ? img.clientWidth : 360) + 16;
    function go(dir){ scroller.scrollBy({left: dir*step, behavior: 'smooth'}); }
    if(prev){ prev.addEventListener('click', function(e){ e.preventDefault(); go(-1); }); }
    if(next){ next.addEventListener('click', function(e){ e.preventDefault(); go(1); }); }
  });
  }
  if(document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start);
})();
