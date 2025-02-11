
///////////////////// 변수할당 //////////////////////

/* 최상위 선택자 */ 
let body = document.querySelector('body');

/* lenis 관련 변수 */ 
let lenis = null; // 

/* 레이아웃, 인트로 관련 변수 */ 
let introTit,
    txtAni,
    meImg,
    meTit,
    exprList,
    exprLink;
/* 슬라이드 관련 변수 */ 
let dot;
let slideCount = 4; // 슬라이드 개수
let currentSlideIndex = 0; // 현재 슬라이드 인덱스
let isScrolling = false; // 스크롤 상태를 확인하는 플래그

/* gsap 관련 변수 */
let activeIndex = null;
let container,
    slickContainer,
    meContainer,
    meImgs,
    meTits,
    eprImg,
    eprCnt,
    button; 

/* 팝업 관련 변수 */ 
let crrnSlidHgh = 0; //현재 슬라이드 높이 (팝업)
let pop,
    popActive,
    popFloatNav,
    popElement,
    popBody,
    closeBtn;


/* GNB 관련 변수 */ 
let gnb,
    gnbItem,
    btnHam;

/* 버튼 관련 변수, 그 외 */
let scrollY,
    arrUp;


document.addEventListener("DOMContentLoaded", function ()  {

    ///////////////////// 변수 재할당 //////////////////////

    /* 레이아웃, 인트로 관련 변수 */ 
    introTit = document.querySelectorAll('.ani--intro span');
    meImg = document.querySelector('.main--me--img:nth-of-type(2)');
    meTit = document.querySelector('.main--me--tit:nth-child(2)');
    txtAni = document.querySelectorAll('.ani--fade-in');
    exprLink =  document.querySelectorAll('.expr--cntns li > a');
    /* 최상위 선택자 */ 
    body = document.querySelector('body');

    /* 슬라이드 관련 변수 */ 
    dot = document.querySelectorAll('.slick--dots');

    /* gsap 관련 변수 */
    container = document.querySelectorAll(".wrap > div");
    slickContainer = document.querySelector('.main--expr');
    meContainer = document.querySelector('.main--me');
    meImgs = document.querySelectorAll('.main--me img');
    meTits = document.querySelectorAll('.ani--opacity > div');
    eprImg = document.querySelectorAll('.ani--spread ol li');
    eprCnt = document.querySelectorAll('.ani--spread ul li');
    button = document.querySelector(".main--expr nav");

    /* 팝업 관련 변수 */ 
    pop = document.querySelector('.pop');
    popActive = document.querySelector('.pop.active');
    popFloatNav = document.querySelector('.pop--float-nav');
    popElement = document.querySelector('.pop');
    popBody = document.querySelector('.pop--body');
    closeBtn = document.querySelector('.pop--nav--close');

    /* GNB 관련 변수 */ 
    gnb = document.querySelector('.ani--gnb');
    gnbItem = document.querySelectorAll("ul.main--gnb li");
    btnHam = document.querySelector('.main--gnb.scr--mo > .ar--btn');

    /* 버튼 관련 변수, 그 외 */
    arrUp = document.querySelector('.arrw--up');



    ///////////////////// 함수 호출, 이벤트 등록 //////////////////////

    loadingAin();
    txtAniHeightSet();
    introAni();
    initPopSlick();
    initLenis();
    gsap();
    gnbMove();
    hamEvent();
    meImgMbSet();
    maintainScrol();
    returnScrol();
    accScrollActive();
    accClickActive();
});

window.addEventListener('load', () => {
    /*  새로고침시 */
    if (body.classList.contains('active')) {
        body.classList.remove('active');
    }
    if (gnb.classList.contains('ham-active')) {
        gnb.classList.remove('ham-active');
    }

    meImgMbSet();
    gsap();
});
window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
    txtAniHeightSet();
    meImgMbSet();
    gsap();
})
window.addEventListener('wheel', (event) => {
    floatGnb(event);
    popFloat();
});
window.addEventListener('scroll', () => {
    //accScrollActive();
    
})

/* Lenis */
function initLenis() {
    /* 팝업에는 lenis 미적용 */ 
    if (popActive) {
        return;
    }
    /* //팝업에는 lenis 미적용 */

    // Lenis 초기화
    lenis = new Lenis({
        smooth: true, // 부드러운 스크롤 활성화
        lerp: 0.1, // 부드러운 스크롤 속도 (0.1 ~ 1.0)
        direction: 'vertical', // 세로 스크롤
    });

    // Lenis의 스크롤 업데이트 함수
    function raf(time) {
        lenis.raf(time); // Lenis 스크롤 프레임 업데이트
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis와 ScrollTrigger 동기화
    lenis.on('scroll', () => ScrollTrigger.update());

    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value) : window.scrollY;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: document.body.style.transform ? "transform" : "fixed",
    });
} 

/* GNB 이동 */ 
function gnbMove() {
    gnbItem.forEach(item => {
        const links = item.querySelectorAll('a');
        links.forEach(item => {
            item.addEventListener('click', function (event) {
                const targetId = this.getAttribute('href').substring(1);
                const targetEle = document.getElementById(targetId);

                if (body.classList.contains('active')) {
                    body.classList.remove('active');
                    gnb.classList.remove('ham-active');
                }
                targetEle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    });
}

/* ham open close */ 
function hamEvent() {
    btnHam.addEventListener('click', function () { 
        const isHamActive = gnb.classList.contains('ham-active');
        if (isHamActive) {
            body.classList.remove('active');
            gnb.classList.remove('ham-active');
            returnScrol();
        } else {
            maintainScrol();
            body.classList.add('active');
            gnb.classList.add('ham-active');
        }
    });
}

/* 현재 스크롤 위치 저장 (햄메뉴 open > close시 필요) */ 
function maintainScrol() {
    scrollY = window.scrollY; // 현재 위치 저장하기
}

/* 스크롤 유지하기 (햄메뉴 open > close시 필요) */ 
function returnScrol() {
    window.scrollTo(0, scrollY);
}

/* gsap 초기화 및 이벤트*/ 
function gsap() {
    if (popActive) { //팝업 active시 gsap미적용
        return;
    }
    ScrollTrigger.matchMedia({
        "(min-width: 1001px)": function () { //pc 일 때 
            container.forEach((element, index) => { // gnb active
                if (gnbItem[index]) {
                    ScrollTrigger.create({
                        trigger: element,
                        start: "top center",
                        end: "bottom center",
                        toggleClass: {
                            targets: gnbItem[index],
                            className: "active",
                        },
                    });
                }
            });
        },

        "(max-width: 1000px)": function () { //태블릿, 모바일
            gnbItem = document.querySelectorAll("div.main--gnb ul li");

            container.forEach((element, index) => {
                if (gnbItem[index]) {
                    ScrollTrigger.create({
                        trigger: element,
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => {
                            activeIndex = index; // 활성화된 index 저장
                            gnbItem.forEach(item => item.classList.remove("active")); // 기존 활성화 제거
                            gnbItem[index].classList.add("active"); // 현재 gnb 활성화
                        },
                    });
                }
            });
        },

        "all": function () {// 공통 설정
            container.forEach((element, index) => { //txt fade-in
                ScrollTrigger.create({
                    trigger: element,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => {
                        element.querySelectorAll('.ani--fade-in').forEach((item) => {
                            item.classList.add('fade-in--active');
                        });
                    },
                });
            });
            container.forEach((element, index) => { //형광펜 효과
                ScrollTrigger.create({
                    trigger: element,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => {
                        element.querySelectorAll('.ani--fade-in u').forEach((item) => {
                            item.classList.add('undrl--active');
                        });
                    },
                });
            });
            container.forEach((element, index) => { // body 배경 색상 변경 애니메이션
                ScrollTrigger.create({
                    trigger: meContainer,
                    start: "top center",
                    end: "bottom center",
                    toggleClass: {
                        targets:  document.querySelector('body'),
                        className: "colr-cnge--active",
                    },
                });
            });
            meImgs.forEach((element, index) => { // me 컨테이너 타이틀 애니메이션
                ScrollTrigger.create({
                        trigger: element,
                        start: "top center",
                        end: "bottom center",
                        toggleClass: {
                            targets: meTits[index],
                            className: "opacity--active",
                        },
                        // markers: true
                });
            });

        },
    });
    // ScrollTrigger 새로고침
    ScrollTrigger.refresh();
}

/* 팝업 슬릭 초기화 및 이벤트 */
function initPopSlick() {
    $('.pop--slick').slick({ //팝업 슬릭 초기화
        dots: false,
        arrow: true, 
        appendArrows: '.float-nav--title',
        prevArrow: '<button class="arrw--prev ar--btn ar--btn-bg-non" aria-label="이전" title="이전"></button>',
        nextArrow: '<button class="arrw--next ar--btn ar--btn-bg-non" aria-label="다음" title="다음"></button>',
        infinite: false,
        adaptiveHeight: false,
    });

    // Slick 슬라이드 높이 동적 설정
    $('.pop--slick').on('setPosition', function () {
        const $currentSlide = $('.pop--slick').find('.slick-current'); // 현재 슬라이드 선택
        crrnSlidHgh = $currentSlide.outerHeight(true); // 현재 슬라이드 높이 계산
        popElement.scrollTo({ top: 0, behavior: 'smooth' });
        $('.pop--slick').css('height', crrnSlidHgh);
    });

    // Slick이 페이지 이동후 이벤트
    $(".pop--slick").on("afterChange", function(event, slick, currentSlide) {

        const titList = document.querySelectorAll('.float-nav--title p');
        const subList = document.querySelectorAll('.float--accrd div');
        const floatNav = document.querySelector('.ani--float-nav');
        const activeClass = 'float-nav--active';

        if (floatNav.classList.contains(activeClass)) { //클래스 제거
            floatNav.classList.remove(activeClass);
        }

        if (currentSlide === 3) return;

        titList.forEach((element) => element.classList.remove("active"));
        subList.forEach((element) => element.classList.remove("active"));

        if (titList[currentSlide]) {
            titList[currentSlide].classList.add("active");
            subList[currentSlide].classList.add("active");
        }
    
        document.body.classList.add("active");
    
        // 팝업을 상단으로 스크롤
        document.querySelector(".pop").scrollTo(0,0);
    });


    /* 팝업 닫기 */
    closeBtn.addEventListener('click', function () {
        document.querySelector('body').classList.remove('active');
        document.querySelector('.pop').classList.remove('active');
        returnScrol();
        popFloatNav.style.visibility = 'hidden';
    });
    /* //팝업 닫기 */
}

/* 프로젝트 클릭시 해당 슬라이드로 이동 */ 
function moveSlide() {
    exprLink.forEach((link, index) => {
        if (index > 8) {
            return;
        }
        link.addEventListener("click", (event) => {
            event.preventDefault(); // 링크 기본 동작 방지
            const index = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
            pop.classList.add('active');

            maintainScrol(); //스크롤 위치 기억

            // 해당 슬라이드로 이동

            document.querySelectorAll('.float-nav--title p')[index].classList.add('active');
            document.querySelectorAll('.float--accrd div')[index].classList.add('active');
            $('.pop--slick').slick("slickGoTo", index);
            popFloatNav.style.visibility = 'visible';
        });
    });
}

function accScrollActive() {
    window.addEventListener('scroll', function() {
        let exprTop = document.querySelector('.main--expr').getBoundingClientRect().top;

        const dvh100 = window.innerHeight;
        const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize); // 1rem을 px로 변환
        const rem5_125 = 5.125 * remToPx; // 5.125rem을 px로 변환

        const calHeight = dvh100 - rem5_125; // 100dvh - 5.125rem

        let content = slickContainer.querySelectorAll('ul li');
        let img = slickContainer.querySelectorAll('ol li');
        let contentArr = Array.from(content);
        let imgArr = Array.from(img);

        content.forEach(element => element.classList.remove('spread--active'));
        img.forEach(element => element.classList.remove('spread--active'));
        
        if (exprTop >= 0 && exprTop < dvh100 * 0.5) {
            imgArr[0].classList.add('spread--active');
            contentArr[0].classList.add('spread--active');

        } else if (exprTop >= -(calHeight) * 0.5) {
            imgArr[0].classList.add('spread--active');
            contentArr[0].classList.add('spread--active');

        } else if (exprTop >= -(calHeight) * 1.5) {
            imgArr[1].classList.add('spread--active');
            contentArr[1].classList.add('spread--active');

        } else if (exprTop >= -(calHeight) * 2.5) {
            imgArr[2].classList.add('spread--active');
            contentArr[2].classList.add('spread--active');

        } else if (exprTop >= -(calHeight) * 3.5) {
            imgArr[3].classList.add('spread--active');
            contentArr[3].classList.add('spread--active');
        }
    });
}

function accClickActive() {
    const workItems = document.querySelectorAll('.expr--cntns li'); 
    const imgItems = document.querySelectorAll('.expr--img li'); 
    workItems.forEach(item => {
        item.addEventListener('click', function(event) {
            const target = event.target;
            const targetParent = target.parentNode;
            const targetId = target.closest('[id]')?.getAttribute('id');
            const targetNum = +targetId.slice(5);
            const targetElement = document.getElementById(targetId);
  
            const siblings = Array.from(targetParent.parentNode.children);
            const index = siblings.indexOf(targetParent);

            if (!targetElement) {
                return;
            }

            if (target.classList.contains('h1')) {
                if (targetElement.classList.contains('spread--active')) {
                    pop.classList.add('active');

                    maintainScrol(); // 스크롤 위치 기억

                    // 해당 슬라이드로 이동
                    document.querySelectorAll('.float-nav--title p')[index]?.classList.add('active');
                    document.querySelectorAll('.float--accrd div')[index]?.classList.add('active');
                    $('.pop--slick').slick("slickGoTo", index);
                    popFloatNav.style.visibility = 'visible';

                } else {
                    eprCnt.forEach(element => element.classList.remove('spread--active'));
                    imgItems.forEach(element => element.classList.remove('spread--active'));

                    console.log(targetNum);
                    console.log(imgItems[targetNum - 1]);

                    targetElement.classList.add('spread--active');
                    imgItems[targetNum - 1].classList.add('spread--active');

                    window.scrollBy({ top: targetElement, left: 0, behavior: 'smooth' });
                }
            } else if (target.classList.contains('h2') || target.classList.contains('h4')) {

                pop.classList.add('active');

                maintainScrol(); // 스크롤 위치 기억

                // 해당 슬라이드로 이동
                document.querySelectorAll('.float-nav--title p')[index]?.classList.add('active');
                document.querySelectorAll('.float--accrd div')[index]?.classList.add('active');
                $('.pop--slick').slick("slickGoTo", index);
                popFloatNav.style.visibility = 'visible';

            } else {
                return;
            }
        });
    });
}

/* 팝업 floatGnb */
function popFloat() {
    const scrollTop = pop.scrollTop;
    const activeClass = 'float-nav--active';
    const isNavActive = popFloatNav.classList.contains(activeClass);

    if (scrollTop > 200 && !isNavActive) {
        popFloatNav.classList.add(activeClass);

    } else if (scrollTop <= 200 && isNavActive) {
        popFloatNav.classList.remove(activeClass);
    }
}

/* GNB가 스크롤을 따라 움직이는 이벤트 */ 
function floatGnb(event) {

    /* 팝업 active시 미적용 */ 
    if (popActive) {
        return;
    }
    
    const scrollY = window.scrollY; // 현재 스크롤 위치
    const dvh100 = window.innerHeight; // 100vh 값

    if (scrollY > dvh100) { // 100vh 보다 스크롤이 아래에 있을 떄
        if (event.deltaY > 0) { // 휠을 아래로 올릴 때
            gnb.classList.remove('fix-active');
        } else if (event.deltaY < 0) { // 휠을 위로 올릴 때
            gnb.classList.add('fix-active');
        }
    } else { // 스크롤이 첫 화면에 있을 때 
        if (gnb.classList.contains('fix-active') && scrollY < 100) {
            gnb.classList.remove('fix-active');
        }
    }
};

/* 로딩 애니메이션 */
function loadingAin() {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading--group');
        const dimElement = document.querySelector('.loading--dim');

        loadingScreen.style.display = 'none';
        dimElement.classList.add('ani--dim-active');

        // 애니메이션 종료 시 클래스 삭제
        dimElement.addEventListener('animationend', () => {
            dimElement.classList.remove('ani--dim-active');
            setTimeout(() => {
                document.querySelector('.wrap').style.visibility = 'visible';
                document.querySelectorAll('.ani--intro').forEach(element => {
                    element.classList.add('intro--active');
                });
            }, 500);
            setTimeout(() => {
                window.scrollTo(0, 0); // 새로고침시 항상 상단
            }, 520)
            
        });

    }, 1000);
}

/* 인트로 타이틀 애니메이션 */
function introAni() {
    introTit.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.3}s`;  
    });
}

/* txt--ani */ 
function txtAniHeightSet() {
    txtAni.forEach((element, index) => {
        let targetH = element.firstElementChild.offsetHeight;
        element.style.height = targetH + 'px';
    });
}

/* me 레이아웃 조절하기 */ 
function meImgMbSet() {
    let meTitH = meTit.offsetHeight;
    meImg.style.marginBottom = meTitH + 'px';
}

















