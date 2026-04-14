document.addEventListener('DOMContentLoaded', () => {
  // --- Generate 50 Study Records ---
  const studyRecordsData = [];
  const topics = [
    { tag: "C", titles: ["이해해보기", "기초 문법", "포인터의 마법", "메모리 구조", "동적 할당 활용", "구조체 이해", "파일 입출력 실습"] },
    { tag: "Linux", titles: ["커널의 구조", "쉘 커맨드 정복", "프로세스 관리", "권한 설정(chmod)", "서버 구축 기초", "Vim 사용법", "패키지 매니저"] },
    { tag: "Web", titles: ["HTML5 시맨틱 태그", "CSS3 플렉스박스", "그리드 레이아웃", "자바스크립트 DOM 조작", "이벨트 루프의 이해", "비동기 프로그래밍", "반응형 디자인"] },
    { tag: "CS", titles: ["자료구조 기초", "알고리즘 복잡도", "정렬 알고리즘", "네트워크 OSI 7계층", "운영체제 스케줄링", "데이터베이스 기초", "컴퓨터 구조"] }
  ];

  const startDate = new Date(2026, 2, 1);
  for (let i = 1; i <= 50; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const titleSuffix = topic.titles[Math.floor(Math.random() * topic.titles.length)];
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + (i * 2));
    const dateStr = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
    
    studyRecordsData.push({
      date: dateStr,
      title: `[Day ${String(i).padStart(2, '0')}] ${topic.tag}: ${titleSuffix}`,
      excerpt: `${topic.tag} 분야의 ${titleSuffix}에 대해 학습했습니다. 기초 개념부터 실제 코드 적용 사례까지 정리해보았습니다.`,
      tags: [topic.tag, "Study"]
    });
  }

  // --- Render Study Records ---
  const recordsContainer = document.getElementById('study-records-container');
  if (recordsContainer) {
    studyRecordsData.slice().reverse().forEach(record => {
      const card = document.createElement('article');
      card.className = 'record-card glass-panel interactive';
      card.innerHTML = `
        <div class="card-date">${record.date}</div>
        <h3 class="card-title">${record.title}</h3>
        <p class="card-excerpt">${record.excerpt}</p>
        <div class="tags">
          ${record.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
      recordsContainer.appendChild(card);
    });
  }
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
      title: 'Linux Kernel',
      records: [
        { date: '2026. 03. 28', title: '커널 컴파일 기초', desc: '리눅스 커널 소스 다운로드 및 기본 빌드 과정 학습.' },
        { date: '2026. 03. 15', title: '시스템 콜 이해', desc: '유저 모드와 커널 모드 사이의 인터페이스인 시스템 콜 동작 방식 파악.' }
      ]
    },
    web: {
      icon: '🌐',
      title: 'Web Architect',
      records: [
        { date: '2026. 03. 20', title: '프론트엔드 아키텍처', desc: '컴포넌트 설계 원칙과 상태 관리 기법에 대한 연구.' },
        { date: '2026. 03. 10', title: '백엔드 시스템 설계', desc: 'RESTful API 설계와 데이터베이스 정규화 전략 학습.' }
      ]
    }
  };

  const projectRecordsData = {
    blog: {
      icon: '🌌',
      title: '우주 테마 개발 블로그',
      records: [
        { date: '2026. 03. 31', title: '프로젝트 개요', desc: '나만의 개성을 담은 포트폴리오 사이트 제작. Glassmorphism과 우주 배경 파티클로 프리미엄 느낌 강조.' },
        { date: '주요 기술', title: 'Vanilla JS & Canvas', desc: '프레임워크 없이 순수 자바스크립트와 Canvas API를 이용해 배경 애니메이션 직접 구현.' }
      ]
    },
    grade: {
      icon: '🖥️',
      title: '학생 성적 관리 프로그램',
      records: [
        { date: '2026. 03. 15', title: '구조체 설계', desc: '이름, 학번, 성적 정보를 담는 Student 구조체 설계 및 동적 할당 관리.' },
        { date: '기능 설명', title: '데이터 정렬 및 검색', desc: '성적순 정렬 기능과 특정 학생 검색 기능을 CLI 환경에서 구현.' }
      ]
    }
  };

  function openSkillModal(key, type = 'skill') {
    const dataSource = type === 'skill' ? skillRecordsData : projectRecordsData;
    if (!dataSource[key]) return;
    
    const data = dataSource[key];
    modalIcon.textContent = data.icon;
    modalTitle.textContent = data.title;
    
    modalBody.innerHTML = ''; 
    
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
      document.body.style.overflow = 'hidden'; 
    }
  }

  const projectCards = document.querySelectorAll('.project-card');

  if (skillCards) {
    skillCards.forEach(card => {
      card.addEventListener('click', () => {
        const skill = card.getAttribute('data-skill');
        if (skill) openSkillModal(skill, 'skill');
      });
    });
  }

  if (projectCards) {
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const project = card.getAttribute('data-project');
        if (project) openSkillModal(project, 'project');
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
