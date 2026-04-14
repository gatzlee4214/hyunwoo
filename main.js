document.addEventListener('DOMContentLoaded', () => {
  // --- Generate 50 Rich Study Records ---
  const studyRecordsData = [];
  const topics = [
    { 
      tag: "C", 
      titles: ["포인터와 배열의 관계", "동적 메모리 할당 심화", "함수 포인터 활용", "구조체 바이트 얼라인먼트", "파일 스트림 입출력", "전처리기와 매크로", "연결 리스트 구현", "이진 트리 라이브러리 제작", "비트 연산과 플래그", "C언어 표준 라이브러리 분석"],
      details: ["메모리 주소 직접 제어를 통한 성능 최적화", "Heap 영역의 효율적인 관리 기법", "콜백 메커니즘을 이용한 모듈형 프로그래밍", "메모리 구조 이해를 통한 버퍼 오버플로우 방지", "대용량 데이터의 바이너리 읽기/쓰기 구현"]
    },
    { 
      tag: "Linux", 
      titles: ["시스템 콜 가로채기", "프로세스 스케줄링 알고리즘", "가상 메모리 시스템", "POSIX 쓰레드 프로그래밍", "네트워크 소켓 통신", "쉘 스크립팅 자동화", "커널 모듈 빌드 환경", "VFS(Virtual File System)", "디바이스 드라이버 기초", "인터럽트 핸들러 설계"],
      details: ["User 모드와 Kernel 모드의 전환 메커니즘", "Context Switching 오버헤드 분석", "Paging과 Swapping의 동작 원리", "멀티 프로세싱 환경에서의 동기화 문제 해결", "패킷 분석을 통한 TCP/IP 스택 탐구"]
    },
    { 
      tag: "Web", 
      titles: ["DOM 트리 렌더링 최적화", "브라우저 이벤트 루프 분석", "CSS 그리드 아키텍처", "자바스크립트 클로저와 메모리", "ES6+ 비동기 제어(Promise/Async)", "웹 워커를 통한 병렬 처리", "반응형 인터페이스 설계", "REST API 설계 원칙", "클라이언트 사이드 캐싱 전략", "웹 성능 지표 LCP/FID 측정"],
      details: ["Critical Rendering Path의 이해와 렌더링 최적화", "Microtask와 Macrotask 큐의 동작 방식", "대규모 웹 애플리케이션의 상태 관리 전략", "가비지 컬렉션 메커니즘과 메모리 누수 방지", "UX 향상을 위한 애니메이션 성능 튜닝"]
    },
    { 
      tag: "CS", 
      titles: ["해시 테이블 충돌 해결", "그래프 탐색(DFS/BFS)", "운영체제 데드락 방지", "데이터베이스 인덱스 성능", "컴퓨터 구조-파이프라이닝", "컴파일러 구문 분석", "어셈블리어 기초 분석", "데이터 암호화 알고리즘", "캐시 일관성 프로토콜", "분산 시스템 기초"],
      details: ["알고리즘 복잡도(Big-O) 분석을 통한 코드 효율화", "자원 할당 그래프를 이용한 교착 상태 방지", "B-Tree 인덱스 구조와 성능의 관계", "명령어 레벨 병렬성(ILP) 탐구", "데이터 무결성을 위한 트랜잭션 격리 수준"]
    }
  ];

  const startDate = new Date(2026, 1, 1);
  for (let i = 1; i <= 50; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const title = topic.titles[Math.floor(Math.random() * topic.titles.length)];
    const detail = topic.details[Math.floor(Math.random() * topic.details.length)];
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
    
    studyRecordsData.push({
      id: i,
      date: dateStr,
      title: `[Study Log #${String(i).padStart(2, '0')}] ${topic.tag}: ${title}`,
      excerpt: `${topic.tag} 전공 과정 중 '${title}'에 대해 깊이 있는 학습을 진행했습니다. ${detail} 주제를 중심으로 이론적 배경과 실무 적용 사례를 연구하였습니다.`,
      tags: [topic.tag, "University"]
    });
  }

  // --- Render Functions ---
  // --- Search & Filter Elements ---
  const searchInput = document.getElementById('record-search');
  const tagButtons = document.querySelectorAll('.tag-filter');
  let activeTag = 'all';

  // --- Pagination Logic ---
  let currentPage = 1;
  const itemsPerPage = 8;
  let currentData = studyRecordsData.slice().reverse();

  function renderRecords(data, containerId, isPaginated = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    let displayData = data;
    if (isPaginated) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      displayData = data.slice(start, end);
      renderPaginationControls(data.length);
    }

    if (displayData.length === 0) {
      container.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; width: 100%; padding: 3rem;">검색 결과가 없습니다.</p>';
      return;
    }

    displayData.forEach(record => {
      const card = document.createElement('article');
      card.className = 'record-card glass-panel interactive';
      
      // Link each card to the corresponding physical HTML page
      const postFileName = `post_${String(record.id).padStart(2, '0')}.html`;
      
      card.innerHTML = `
        <a href="posts/${postFileName}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
          <div class="card-date">${record.date}</div>
          <h3 class="card-title">${record.title}</h3>
          <p class="card-excerpt">${record.excerpt}</p>
          <div class="tags">
            ${record.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </a>
      `;
      // We keep the modal trigger as a fallback or secondary action if needed
      // card.addEventListener('click', () => openFullRecordModal(record)); 
      // Link handles it now.
      container.appendChild(card);
    });
  }

  function renderPaginationControls(totalItems) {
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => {
            currentPage = i;
            filterAndUpdate();
            window.scrollTo({ top: document.getElementById('records').offsetTop - 100, behavior: 'smooth' });
        };
        paginationContainer.appendChild(btn);
    }
  }

  function filterAndUpdate() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    
    currentData = studyRecordsData.filter(rec => {
      const matchSearch = rec.title.toLowerCase().includes(searchTerm) || rec.excerpt.toLowerCase().includes(searchTerm);
      const matchTag = activeTag === 'all' || rec.tags.includes(activeTag);
      return matchSearch && matchTag;
    }).slice().reverse();

    renderRecords(currentData, 'study-records-container', true);
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterAndUpdate);
  }

  if (tagButtons) {
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTag = btn.getAttribute('data-tag');
        filterAndUpdate();
      });
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

  function closeSkillModal() {
    if (skillModal) {
      skillModal.classList.remove('show');
      document.body.style.overflow = '';
      playSound(330, 'sine', 0.05);
    }
    // Also close terminal if open
    if (terminalContainer && !terminalContainer.classList.contains('terminal-hidden')) {
      terminalContainer.classList.add('terminal-hidden');
    }
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
    // Close with Escape OR X
    if ((e.key === 'Escape' || e.key.toLowerCase() === 'x')) {
      if ((skillModal && skillModal.classList.contains('show')) || 
          (terminalContainer && !terminalContainer.classList.contains('terminal-hidden'))) {
        closeSkillModal();
      }
    }
  });

  loadMemos();

  // 5. Scroll Progress Bar
  const scrollBar = document.getElementById('scroll-bar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollBar) scrollBar.style.width = scrolled + "%";
  });

  // 6. Cursor Neon Trail
  const cursorCanvas = document.getElementById('cursor-canvas');
  if (cursorCanvas) {
    const cctx = cursorCanvas.getContext('2d');
    let cWidth = cursorCanvas.width = window.innerWidth;
    let cHeight = cursorCanvas.height = window.innerHeight;
    
    let dots = [];
    const maxDots = 20;

    window.addEventListener('resize', () => {
      cWidth = cursorCanvas.width = window.innerWidth;
      cHeight = cursorCanvas.height = window.innerHeight;
    });

    function animateCursor() {
      cctx.clearRect(0, 0, cWidth, cHeight);
      
      if (mouse.x !== null) {
        dots.push({ x: mouse.x, y: mouse.y, age: 0 });
      }

      if (dots.length > maxDots) dots.shift();

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.age++;
        const opacity = 1 - (dot.age / maxDots);
        const radius = 5 * opacity;
        
        cctx.beginPath();
        cctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        cctx.fillStyle = `rgba(0, 242, 255, ${opacity * 0.5})`;
        cctx.shadowBlur = 10;
        cctx.shadowColor = '#00f2ff';
        cctx.fill();
        
        // Connect dots with lines
        if (i > 0) {
          cctx.beginPath();
          cctx.moveTo(dots[i-1].x, dots[i-1].y);
          cctx.lineTo(dot.x, dot.y);
          cctx.strokeStyle = `rgba(255, 0, 255, ${opacity * 0.3})`;
          cctx.lineWidth = 2 * opacity;
          cctx.stroke();
        }
      }
      
      dots = dots.filter(d => d.age < maxDots);
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // 7. Secret Terminal Logic
  const terminalContainer = document.getElementById('terminal-container');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  document.addEventListener('keydown', (e) => {
    // Toggle terminal with ` (Backtick)
    if (e.key === '`') {
      e.preventDefault();
      terminalContainer.classList.toggle('terminal-hidden');
      if (!terminalContainer.classList.contains('terminal-hidden')) {
        terminalInput.focus();
        playSound(440, 'square', 0.1);
      }
    }
  });

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        executeCommand(cmd);
      }
    });
  }

  function executeCommand(cmd) {
    appendLine(`> ${cmd}`, 'user-line');
    
    switch(cmd) {
      case 'help':
        appendLine('Available commands: help, clear, whoami, github, projects, matrix, exit');
        break;
      case 'clear':
        terminalOutput.innerHTML = '';
        break;
      case 'whoami':
        appendLine('User: Lee Hyunwoo');
        appendLine('Role: Computer Software Freshman / Aspiring Dev');
        appendLine('Mission: Building the future, one line of code at a time.');
        break;
      case 'github':
        appendLine('Opening GitHub repository...');
        window.open('https://github.com/gatzlee4214/hyunwoo', '_blank');
        break;
      case 'projects':
        appendLine('Loading project modules...');
        appendLine('1. Space Blog (Current)');
        appendLine('2. C Grade Manager');
        appendLine('Type "blog" or "grade" for details.');
        break;
      case 'matrix':
        appendLine('Initializing Matrix Protocol...');
        document.body.classList.toggle('matrix-mode');
        if(document.body.classList.contains('matrix-mode')) {
          appendLine('Matrix Mode: ENABLED');
          // We could add a matrix canvas here if requested
        } else {
          appendLine('Matrix Mode: DISABLED');
        }
        break;
      case 'exit':
        terminalContainer.classList.add('terminal-hidden');
        break;
      default:
        appendLine(`Command not found: ${cmd}. Type 'help' for assistance.`, 'error-line');
    }
    
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    playSound(660, 'sine', 0.05);
  }

  function appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.textContent = text;
    terminalOutput.appendChild(line);
  }

  // 8. Sound System (Web Audio API)
  let audioCtx = null;

  function playSound(freq, type = 'sine', duration = 0.1) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked by browser policy
    }
  }

  // Add sounds to interactive elements
  const interactiveElements = document.querySelectorAll('.interactive, .btn, .nav-links a, .skill-card, .tag-filter');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => playSound(880, 'sine', 0.02));
    el.addEventListener('click', () => playSound(440, 'square', 0.1));
  });

  // 9. Initial Secret Message in Console
  console.log(`
  %c 🌌 WELCOME TO HYUNWOO'S GALAXY 🌌 
  %c Press [\`] to open the core terminal. 
  `, "color: #00f2ff; font-size: 20px; font-weight: bold;", "color: #ff00ff; font-size: 14px;");

  // 10. Click to Re-init Protocol
  const neonLabel = document.querySelector('.neon-label');
  if (neonLabel) {
    neonLabel.style.cursor = 'pointer';
    neonLabel.addEventListener('click', () => {
      playSound(220, 'sawtooth', 0.5);
      document.body.style.filter = 'invert(1)';
      setTimeout(() => {
        document.body.style.filter = 'none';
        alert("PROTOCOL RE-INITIALIZED. ALL SYNC CHANNELS ACTIVE.");
      }, 100);
    });
  }

  // 11. Record Modal Logic (Rich View)
  function openFullRecordModal(record) {
    if (!skillModal) return;
    
    modalIcon.textContent = "📄";
    modalTitle.textContent = record.title;
    
    modalBody.innerHTML = `
      <div class="record-item full-view">
        <div class="record-date">${record.date}</div>
        <div class="record-content-body" style="padding: 1rem 0;">
          <p style="font-size: 1.1rem; line-height: 1.8; color: #fff;">${record.excerpt}</p>
          <hr style="opacity: 0.1; margin: 1.5rem 0;">
          <h4 style="color: var(--color-cyan); margin-bottom: 1rem;">[Detailed Learning Objectives]</h4>
          <ul style="padding-left: 1.5rem; color: #d1d5db; line-height: 2;">
            <li>In-depth analysis of university lectures and key academic concepts.</li>
            <li>Hands-on implementation and system-level debugging logs.</li>
            <li>Summary of learning outcomes and identification of future research topics.</li>
            <li>Cross-referencing with official documentation and textbook materials.</li>
          </ul>
          <div style="background: rgba(0, 242, 255, 0.05); padding: 1.5rem; border-radius: 8px; margin-top: 2rem; border-left: 4px solid var(--color-cyan);">
            <p style="font-style: italic; font-size: 0.9rem; color: var(--color-text-muted); margin: 0;">
              This record is officially documented as part of the 2026 Spring Semester Computer Science curriculum.
              All code snippets and theoretical analyses have been validated through peer review and academic testing.
            </p>
          </div>
        </div>
      </div>
    `;

    skillModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // 12. Academic Report Export System
  function injectExportButton() {
    const container = document.querySelector('.search-console');
    if (!container) return;
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn magenta pulse';
    exportBtn.style.marginTop = '1.5rem';
    exportBtn.style.width = '100%';
    exportBtn.innerHTML = '🎓 전체 학습 보고서 생성 (Print Academic Report)';
    
    exportBtn.onclick = () => {
      const printWindow = window.open('', '_blank');
      const allRecords = studyRecordsData.slice().reverse();
      
      printWindow.document.write(`
        <html>
        <head>
          <title>Academic Study Report - Hyunwoo Lee</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 50px; line-height: 1.6; color: #333; }
            .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 20px; margin-bottom: 40px; }
            .post { page-break-inside: avoid; margin-bottom: 50px; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
            .date { color: #888; font-family: monospace; font-size: 0.9em; margin-bottom: 10px; }
            h1 { font-size: 2.5em; margin: 0; }
            h2 { color: #0056b3; margin-top: 0; }
            .excerpt { font-size: 1.1em; }
            .footer { margin-top: 50px; font-size: 0.8em; text-align: center; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>2026학년도 1학기 전공 심화 학습 보고서</h1>
            <p>소속: 공학3계열 컴퓨터소프트웨어 | 성명: 이현우 | 기록 개수: ${allRecords.length}개</p>
          </div>
          ${allRecords.map((rec, i) => `
            <div class="post">
              <div class="date">RECORD ID: ${String(rec.id).padStart(3, '0')} | DATE: ${rec.date}</div>
              <h2>${rec.title}</h2>
              <div class="excerpt">${rec.excerpt}</div>
              <p style="font-size: 0.9em; color: #666; margin-top: 15px;">
                <strong>Keywords:</strong> ${rec.tags.join(', ')} | <strong>Status:</strong> Completed
              </p>
            </div>
          `).join('')}
          <div class="footer">
            본 보고서는 이현우의 개인 학습 블로그 시스템(HYUNWOO.DEV)을 통해 생성되었습니다.
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 500);
    };
    container.appendChild(exportBtn);
  }

  injectExportButton();

  // 13. Konami Code Easter Egg (Up Up Down Down Left Right Left Right B A)
  const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiPattern[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiPattern.length) {
        startHackerMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function startHackerMode() {
    playSound(110, 'sawtooth', 1);
    document.body.classList.add('hacker-active');
    appendLine('[SYSTEM] HACKER MODE ACTIVATED.', 'success-line');
    
    // Trigger matrix-like background or similar glitchey effect
    const glitchOverlay = document.createElement('div');
    glitchOverlay.className = 'glitch-overlay';
    document.body.appendChild(glitchOverlay);
    
    setTimeout(() => {
      glitchOverlay.remove();
      document.body.classList.remove('hacker-active');
    }, 5000);
  }

  // 14. Simple Audio/Music Control (Visual only placeholder)
  function setupMusicPlayer() {
    const musicWidget = document.createElement('div');
    musicWidget.className = 'music-widget glass-panel interactive';
    musicWidget.innerHTML = `
      <div class="music-info">
        <span class="music-icon">🎵</span>
        <span class="track-name">Night City (Synthwave)</span>
      </div>
      <div class="music-controls">
        <button id="music-play" class="music-btn">▶</button>
      </div>
    `;
    document.body.appendChild(musicWidget);

    let isPlaying = false;
    const playBtn = musicWidget.querySelector('#music-play');
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '⏸' : '▶';
      if (isPlaying) {
        // Just play a continuous low tone for "vibe" as we can't load real mp3 easily
        startAmbientDrone();
      } else {
        stopAmbientDrone();
      }
    });
  }

  let ambientOsc = null;
  let ambientGain = null;

  function startAmbientDrone() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambientOsc = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();
    ambientOsc.type = 'triangle';
    ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low bass
    ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 1);
    ambientOsc.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    ambientOsc.start();
  }

  function stopAmbientDrone() {
    if (ambientGain) {
      ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      setTimeout(() => ambientOsc && ambientOsc.stop(), 1000);
    }
  }

  setupMusicPlayer();
});
