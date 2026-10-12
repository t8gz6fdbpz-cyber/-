import { useEffect, useId } from "react";
import { motion, useAnimationControls, type TargetAndTransition, type Variants } from "framer-motion";

// Masks follow the existing artwork's actual contours; the original PNG supplies
// every yellow pixel and its texture. No replacement font or redrawn monogram.
const layers = [
  {
    "name": "w",
    "path": "M191 849 L188 836 L164 568 L164 555 L166 545 L176 525 L186 515 L196 509 L206 506 L224 506 L234 509 L244 515 L255 526 L258 533 L260 534 L266 553 L267 571 L268 714 L270 721 L274 721 L276 719 L281 706 L283 705 L285 698 L304 662 L304 659 L318 634 L326 626 L340 619 L356 619 L362 621 L370 626 L379 635 L393 661 L393 664 L398 672 L398 675 L402 681 L402 684 L406 690 L406 693 L411 701 L418 719 L420 721 L423 721 L425 719 L425 532 L425 517 L432 497 L445 480 L462 469 L478 465 L498 468 L505 472 L513 480 L518 493 L518 758 L515 766 L510 772 L487 779 L472 788 L460 800 L451 816 L446 838 L448 866 L456 891 L467 909 L456 912 L433 911 L414 904 L413 902 L405 898 L402 894 L400 894 L385 877 L377 861 L375 860 L345 796 L340 797 L334 810 L332 811 L330 817 L324 825 L320 835 L318 836 L317 840 L315 841 L313 847 L311 848 L309 854 L307 855 L297 873 L285 885 L271 893 L260 896 L247 897 L235 895 L225 891 L224 889 L213 883 L205 875 L205 873 L199 867Z",
    "origin": [340, 690],
    "order": 0
  },
  {
    "name": "j",
    "path": "M505 792 L526 792 L543 801 L557 819 L564 837 L574 847 L588 852 L601 851 L610 847 L618 840 L625 825 L625 726 L629 710 L638 696 L651 686 L664 682 L676 682 L684 684 L699 693 L707 703 L713 717 L715 731 L714 827 L714 846 L706 875 L691 902 L671 924 L669 924 L665 929 L663 929 L661 932 L659 932 L649 940 L619 953 L588 958 L563 956 L537 948 L509 931 L487 909 L478 893 L476 892 L470 879 L464 853 L464 839 L468 823 L473 813 L485 800 L498 793Z",
    "origin": [590, 820],
    "order": 1
  },
  {
    "name": "h",
    "path": "M732 799 L732 489 L738 474 L749 463 L757 459 L767 457 L776 457 L788 460 L801 467 L814 480 L821 492 L826 514 L826 630 L828 637 L833 645 L843 653 L853 656 L949 656 L959 653 L967 648 L974 640 L978 630 L980 558 L986 536 L993 524 L1001 515 L1015 506 L1031 502 L1044 503 L1059 509 L1073 521 L1082 536 L1087 556 L1087 570 L1082 615 L1060 848 L1054 866 L1049 875 L1037 888 L1035 888 L1028 894 L1010 899 L994 897 L985 892 L977 884 L971 874 L967 858 L967 767 L964 758 L958 750 L956 750 L951 745 L942 742 L854 742 L840 748 L833 755 L828 766 L827 855 L822 873 L810 893 L797 906 L795 906 L787 913 L766 922 L741 926 L717 925 L701 922 L699 921 L699 919 L714 899 L721 885 L728 865 L732 843Z",
    "origin": [890, 690],
    "order": 2
  },
  {
    "name": "curve",
    "path": "M733 448 L733 450 L725 458 L723 458 L720 462 L710 467 L709 469 L691 477 L673 482 L642 486 L619 486 L592 483 L559 475 L523 460 L522 458 L509 452 L508 450 L497 444 L495 441 L493 441 L491 438 L489 438 L486 434 L484 434 L450 400 L448 400 L442 394 L430 389 L416 389 L409 392 L402 398 L394 412 L388 433 L378 487 L373 501 L366 514 L353 528 L339 536 L327 539 L314 539 L298 535 L286 529 L276 520 L274 520 L258 500 L253 489 L250 476 L251 453 L260 430 L262 429 L264 423 L269 418 L271 413 L277 407 L277 405 L300 382 L322 363 L324 363 L337 353 L341 352 L342 350 L363 339 L397 328 L428 326 L448 330 L469 340 L470 342 L474 343 L479 348 L484 350 L486 353 L488 353 L491 357 L493 357 L496 361 L498 361 L512 373 L520 377 L522 380 L553 396 L590 406 L616 407 L632 405 L651 399 L654 395 L654 392 L651 389 L639 386 L628 380 L614 367 L608 357 L605 348 L605 327 L611 313 L625 300 L643 293 L665 293 L687 300 L710 315 L729 335 L743 359 L751 387 L751 411 L747 427 L741 439ZM990 433 L997 447 L1000 461 L1000 473 L996 491 L988 506 L972 523 L955 533 L937 538 L923 538 L914 536 L897 527 L882 510 L876 498 L870 480 L862 434 L854 407 L846 395 L836 389 L831 389 L803 391 L790 385 L783 377 L780 369 L780 356 L785 345 L795 336 L817 328 L849 327 L865 330 L886 337 L904 346 L905 348 L920 356 L935 369 L937 369 L970 402 L970 404 L974 407 L974 409 L986 424Z",
    "origin": [625, 415],
    "order": 0
  },
  {
    "name": "face",
    "path": "M549 575 L549 566 L552 556 L557 552 L567 551 L570 552 L577 561 L577 576 L577 590 L575 594 L570 599 L559 600 L555 598 L550 591ZM674 588 L673 564 L678 554 L684 551 L694 552 L699 557 L701 562 L701 589 L697 597 L691 600 L683 600 L676 595ZM654 649 L648 652 L640 652 L632 649 L627 644 L624 644 L619 649 L611 652 L602 652 L594 649 L587 642 L585 638 L585 631 L589 626 L595 625 L599 627 L601 632 L611 633 L615 629 L617 621 L615 618 L611 618 L610 616 L606 611 L606 606 L610 601 L638 600 L642 602 L645 607 L645 611 L641 617 L634 620 L635 628 L640 633 L648 633 L653 626 L659 625 L662 626 L666 632 L666 637 L663 643 L658 648Z",
    "origin": [625, 600],
    "order": 0
  }
] as const;

const identity = { x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0 };
// The mark now moves as one connected silhouette. Letter offsets only open
// a little breathing room; J never rises into the face or upper curves.
function gesture(layer: typeof layers[number], idle: boolean): TargetAndTransition {
  const outward = idle ? 40 : 44;
  const scale = idle ? 1.125 : 1.135;
  return {
    ...identity,
    x: layer.name === "w" ? [null, -outward, 0] : layer.name === "h" ? [null, outward, 0] : 0,
    y: [null, -72 + (layer.name === "j" ? 18 : 0), 0],
    // Every part uses the same center and uniform expansion, retaining the
    // silhouette instead of stretching individual strokes in opposing ways.
    scaleX: [null, scale, 1], scaleY: [null, scale, 1],
    transition: {
      duration: idle ? 0.7 : 0.64,
      delay: (idle ? 0 : 0.18) + layer.order * 0.045,
      times: [0, 0.44, 1], ease: [0.45, 0, 0.55, 1],
    },
  };
}
const variants: Variants = {
  rest: { ...identity, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
  greet: (layer: typeof layers[number]) => gesture(layer, false),
  wave: (layer: typeof layers[number]) => gesture(layer, true),
};

export function AnimatedMonogram({ active, reducedMotion, tone }: { active: boolean; reducedMotion: boolean; tone?: string }) {
  const instance = useId().replace(/:/g, "");
  const controls = useAnimationControls();

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const clear = () => { if (timer !== undefined) clearTimeout(timer); };
    const schedule = (delay = 4500 + Math.random() * 2000) => {
      if (disposed || active || reducedMotion || document.hidden) return;
      timer = setTimeout(async () => {
        await controls.start("wave");
        if (!disposed) schedule();
      }, delay);
    };
    const respond = () => {
      clear();
      controls.stop();
      if (reducedMotion || document.hidden) {
        controls.set("rest");
        return;
      }
      void controls.start(active ? "greet" : "rest");
      schedule(2200 + Math.random() * 600);
    };
    respond();
    document.addEventListener("visibilitychange", respond);
    return () => {
      disposed = true;
      clear();
      controls.stop();
      document.removeEventListener("visibilitychange", respond);
    };
  }, [active, controls, reducedMotion]);

  return (
    <svg className="floating-monogram" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false">
      <defs>
        <image id={`${instance}-art`} href="/assets/wujiahao-monogram-cutout.lossless.webp" width="1254" height="1254" />
        {/* Composite the untouched color through its luminance: black stays in
            the fixed button, while the letters can move independently. */}
        <filter id={`${instance}-ink`} x="0" y="0" width="1254" height="1254" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .2126 .7152 .0722 0 0" />
          <feComponentTransfer result="ink">
            <feFuncA type="linear" slope="5" intercept="-.35" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="ink" operator="in" result="silhouette" />
          {tone && <><feFlood result="surface-color" style={{ floodColor: tone, transition: reducedMotion ? "none" : "flood-color 180ms linear" }} /><feComposite in="surface-color" in2="silhouette" operator="in" /></>}
        </filter>
        {layers.map(layer => (
          <mask key={layer.name} id={`${instance}-${layer.name}`} x="0" y="0" width="1254" height="1254" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
            <path d={layer.path} fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round" />
          </mask>
        ))}
      </defs>
      {layers.map(layer => (
        <motion.g key={layer.name} data-monogram-part={layer.name} custom={layer} initial={false} animate={controls} variants={variants} style={{ originX: 0.5, originY: 0.5 }}>
          <use href={`#${instance}-art`} filter={`url(#${instance}-ink)`} mask={`url(#${instance}-${layer.name})`} />
        </motion.g>
      ))}
    </svg>
  );
}
