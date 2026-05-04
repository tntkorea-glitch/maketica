import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "maketica <noreply@maketica.co.kr>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[DEV] 비밀번호 재설정 링크:\n${resetUrl}\n`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: "[maketica] 비밀번호 재설정 링크",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h2 style="font-size:20px;font-weight:700;color:#111;margin-bottom:8px">비밀번호 재설정</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:24px">
          아래 버튼을 클릭해 새 비밀번호를 설정하세요.<br>링크는 <strong>1시간</strong> 동안 유효합니다.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
          비밀번호 재설정하기
        </a>
        <p style="color:#aaa;font-size:12px;margin-top:24px">
          본인이 요청하지 않았다면 이 이메일을 무시하세요.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#ccc;font-size:11px">maketica CPA 제휴마케팅 플랫폼</p>
      </div>
    `,
  });
}
