document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation & Scroll Logic
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // 2. Galaxy Particle Canvas Logic
  const canvas = document.getElementById('space-canvas');
  if(!canvas) return; // safety
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  let particles = [];
  
  // Mouse interaction variables
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.opacity = Math.random();
      
      // Some stars blink
      this.blinkSpeed = Math.random() * 0.02;
    }

    draw() {
      ctx.fillStyle = `rgba(180, 230, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Blinking logic
      this.opacity += this.blinkSpeed;
      if (this.opacity >= 1 || this.opacity <= 0.1) {
        this.blinkSpeed = -this.blinkSpeed;
      }
      
      // Moving in space slowly
      this.y -= 0.1;
      if (this.y < 0) {
        this.y = height;
        this.x = Math.random() * width;
        this.baseX = this.x;
      }

      // Mouse interactivity (Galaxy disruption)
      if(mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        
        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
        }
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    let numberOfParticles = (width * height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // 3. Guestbook / Memo Board Logic (LocalStorage)
  const memoForm = document.getElementById('memo-form');
  const memoAuthor = document.getElementById('memo-author');
  const memoContent = document.getElementById('memo-content');
  const memosList = document.getElementById('memos-list');

  const MEMO_STORAGE_KEY = 'hyunwoo_blog_memos';

  // Load memos
  function loadMemos() {
    const savedMemos = JSON.parse(localStorage.getItem(MEMO_STORAGE_KEY)) || [];
    memosList.innerHTML = '';
    
    if (savedMemos.length === 0) {
      memosList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 2rem;">아직 남겨진 메모가 없습니다. 첫 메모를 작성해보세요!</p>';
      return;
    }

    // Render memos in reverse order (newest first)
    savedMemos.slice().reverse().forEach(memo => {
      const memoCard = document.createElement('div');
      memoCard.classList.add('memo-card');
      
      memoCard.innerHTML = `
        <div class="memo-header">
          <span class="memo-author">${escapeHTML(memo.author)}</span>
          <span class="memo-date">${memo.date}</span>
        </div>
        <div class="memo-text">${escapeHTML(memo.content)}</div>
      `;
      memosList.appendChild(memoCard);
    });
  }

  // Handle Save
  if (memoForm) {
    memoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const author = memoAuthor.value.trim();
      const content = memoContent.value.trim();
      
      if (!author || !content) return;

      const dateObj = new Date();
      const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
      
      const savedMemos = JSON.parse(localStorage.getItem(MEMO_STORAGE_KEY)) || [];
      savedMemos.push({ author, content, date: dateStr });
      
      localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(savedMemos));
      
      // Clear inputs
      // memoAuthor.value = ''; // 작성자 이름은 유지할 수도 있지만 일단 비움
      // 사실 작성자는 유지하는게 사용자 경험상 좋을 수도 있으나, 방명록이므로 닉네임을 다시 적게 비우겠습니다.
      memoAuthor.value = '';
      memoContent.value = '';
      
      // Reload
      loadMemos();
    });
  }

  // Basic HTML Escaper to prevent XSS in local DOM
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );
  }

  // 4. Tech Stack Modal Logic
  const skillCards = document.querySelectorAll('.skill-card');
  const skillModal = document.getElementById('skill-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  const skillRecordsData = {
    c: {
      icon: 'C',
      title: 'C Language',
      records: [
        { date: '2026. 03. 31', title: '포인터의 이해', desc: '포인터의 개념과 메모리 주소 할당 구조, 배열과의 차이점 학습.' },
        { date: '2026. 03. 25', title: '구조체와 동적 할당', desc: 'struct를 활용한 데이터 모델링 및 malloc/free를 이용한 성적 관리 프로그램 구성.' }
      ]
    },
    linux: {
      icon: '🐧',
      title: 'Linux',
      records: [
        { date: '2026. 03. 28', title: '기본 쉘 명령어', desc: 'cd, ls, grep, pwd 등 쉘 조작 기초 명령어 학습.' },
        { date: '2026. 03. 15', title: '권한 관리', desc: 'chmod, chown을 활용한 리눅스 파일 시스템 권한 체계 이해.' }
      ]
    },
    html: {
      icon: '🌐',
      title: 'HTML / CSS',
      records: [
        { date: '2026. 03. 20', title: '글래스모피즘(Glassmorphism) 구현', desc: 'backdrop-filter: blur()와 rgba 배경을 조합한 유리 질감 UI 제작.' },
        { date: '2026. 03. 10', title: '시맨틱 웹과 접근성', desc: 'header, main, section 태그의 올바른 사용과 폼 요소 접근성 개선.' }
      ]
    },
    js: {
      icon: 'JS',
      title: 'JavaScript',
      records: [
        { date: '2026. 03. 30', title: 'Canvas API 기초', desc: 'HTML5 <canvas>를 활용한 우주 파티클 애니메이션 및 마우스 상호작용 구현.' },
        { date: '2026. 03. 22', title: 'Intersection Observer', desc: '스크롤 위치에 따른 네비게이션 액티브 상태 동적 변경 및 요소 페이드인 적용.' }
      ]
    },
    git: {
      icon: '⌨️',
      title: 'Git / GitHub',
      records: [
        { date: '2026. 03. 31', title: 'Vercel 연동 배포', desc: 'GitHub 저장소와 Vercel을 연동하여 정적 호스팅 환경 구축.' },
        { date: '2026. 03. 05', title: '브랜치 전략', desc: 'feature 브랜치 생성 및 병합, 충돌(Conflict) 해결 방법 실습.' }
      ]
    },
    more: {
      icon: '🚀',
      title: 'Future Roadmap',
      records: [
        { date: '예정', title: 'Data Structures & Algorithms', desc: '자료구조(스택, 큐, 트리, 그래프) 및 기본 알고리즘 학습 계획.' },
        { date: '예정', title: 'React / Next.js', desc: '모던 프론트엔드 프레임워크를 활용한 컴포넌트 기반 UI 개발.' },
        { date: '예정', title: 'Backend / DB', desc: 'Node.js 또는 Java를 이용한 서버 구축 및 데이터베이스 연동.' }
      ]
    }
  };

  function openSkillModal(skillKey) {
    if (!skillRecordsData[skillKey]) return;
    
    const data = skillRecordsData[skillKey];
    modalIcon.textContent = data.icon;
    modalTitle.textContent = data.title;
    
    modalBody.innerHTML = ''; // clear
    
    if (data.records.length === 0) {
      modalBody.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">아직 등록된 기록이 없습니다.</p>';
    } else {
      data.records.forEach(rec => {
        const item = document.createElement('div');
        item.classList.add('record-item');
        item.innerHTML = `
          <div class="record-date">${rec.date}</div>
          <div class="record-title">${rec.title}</div>
          <div class="record-desc">${rec.desc}</div>
        `;
        modalBody.appendChild(item);
      });
    }

    if (skillModal) {
      skillModal.classList.add('show');
      document.body.style.overflow = 'hidden'; // prevent bg scroll
    }
  }

  function closeSkillModal() {
    if (skillModal) {
      skillModal.classList.remove('show');
      document.body.style.overflow = ''; // restore bg scroll
    }
  }

  if (skillCards) {
    skillCards.forEach(card => {
      card.addEventListener('click', () => {
        const skill = card.getAttribute('data-skill');
        if (skill) openSkillModal(skill);
      });
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeSkillModal);
  }

  if (skillModal) {
    skillModal.addEventListener('click', (e) => {
      if (e.target === skillModal) closeSkillModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillModal && skillModal.classList.contains('show')) {
      closeSkillModal();
    }
  });

  loadMemos();
});
