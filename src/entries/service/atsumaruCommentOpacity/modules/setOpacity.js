// アツマールのコメントのcssセレクタ
const ATSUMARU_COMMENT_SELECTOR = '.comment_box';

/**
 * コメントの不透明度を設定
 * @param opacity
 */
export function setOpacity(opacity) {
  if (isNaN(opacity)) return;

  const commentBox = document.querySelector(ATSUMARU_COMMENT_SELECTOR);
  if (!commentBox) return;

  commentBox.style.opacity = String(opacity / 255);
}
