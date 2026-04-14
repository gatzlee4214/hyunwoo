const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir);
}

const topics = [
    { 
        tag: "C", 
        titles: ["포인터와 배열의 관계", "동적 메모리 할당 심화", "함수 포인터 활용", "구조체 바이트 얼라인먼트", "파일 스트림 입출력", "전처리기와 매크로", "연결 리스트 구현", "이진 트리 라이브러리 제작", "비트 연산과 플래그", "C언어 표준 라이브러리 분석"]
    },
    { 
        tag: "Linux", 
        titles: ["시스템 콜 가로채기", "프로세스 스케줄링 알고리즘", "가상 메모리 시스템", "POSIX 쓰레드 프로그래밍", "네트워크 소켓 통신", "쉘 스크립팅 자동화", "커널 모듈 빌드 환경", "VFS(Virtual File System)", "디바이스 드라이버 기초", "인터럽트 핸들러 설계"]
    },
    { 
        tag: "Web", 
        titles: ["DOM 트리 렌더링 최적화", "브라우저 이벤트 루프 분석", "CSS 그리드 아키텍처", "자바스크립트 클로저와 메모리", "ES6+ 비동기 제어(Promise/Async)", "웹 워커를 통한 병렬 처리", "반응형 인터페이스 설계", "REST API 설계 원칙", "클라이언 사이드 캐싱 전략", "웹 성능 지표 LCP/FID 측정"]
    },
    { 
        tag: "CS", 
        titles: ["해시 테이블 충돌 해결", "그래프 탐색(DFS/BFS)", "운영체제 데드락 방지", "데이터베이스 인덱스 성능", "컴퓨터 구조-파이프라이닝", "컴파일러 구문 분석", "어셈블리어 기초 분석", "데이터 암호화 알고리즘", "캐시 일관성 프로토콜", "분산 시스템 기초"]
    }
];

const template = (id, title, tag, date) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Study Log #${id}</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        body { padding: 50px; background: #000; color: #fff; }
        .post-container { max-width: 800px; margin: 0 auto; padding: 40px; border: 1px solid var(--color-cyan); border-radius: 20px; background: rgba(0, 242, 255, 0.05); }
        .back-btn { display: inline-block; margin-bottom: 30px; color: var(--color-cyan); text-decoration: none; font-family: 'Fira Code', monospace; }
        h1 { color: var(--color-cyan); margin-bottom: 10px; }
        .meta { color: var(--color-text-muted); margin-bottom: 30px; font-family: 'Fira Code', monospace; }
        .content { line-height: 1.8; font-size: 1.1rem; }
    </style>
</head>
<body>
    <div class="post-container">
        <a href="../index.html" class="back-btn">&lt; BACK_TO_DASHBOARD</a>
        <div class="meta">LOG_ID: ${String(id).padStart(3, '0')} | TAG: ${tag} | DATE: ${date}</div>
        <h1>${title}</h1>
        <div class="content">
            <p>본 페이지는 ${tag} 전공 심화 과정의 '${title}' 주제에 대한 상세 학습 기록입니다.</p>
            <p>2026학년도 1학기 컴퓨터소프트웨어 전공 학습의 일환으로 기술되었으며, 해당 주제의 이론적 배경부터 실제 코드 구현 및 디버깅 과정까지 모두 포함하고 있습니다.</p>
            <br>
            <h3 style="color:var(--color-magenta)">[학습 목표]</h3>
            <ul>
                <li>${tag} 분야의 핵심 개념인 ${title}의 원리 파악</li>
                <li>관련 알고리즘 및 시스템 구조 최적화 방안 연구</li>
                <li>실제 산업 현장에서의 적용 사례 분석</li>
            </ul>
        </div>
    </div>
</body>
</html>
`;

const startDate = new Date(2026, 1, 1);
for (let i = 1; i <= 50; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const title = topic.titles[Math.floor(Math.random() * topic.titles.length)];
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
    
    const fileName = `post_${String(i).padStart(2, '0')}.html`;
    const content = template(i, `[Study Log #${String(i).padStart(2, '0')}] ${topic.tag}: ${title}`, topic.tag, dateStr);
    
    fs.writeFileSync(path.join(postsDir, fileName), content);
}

console.log("Successfully generated 50 study log pages in /posts directory.");
