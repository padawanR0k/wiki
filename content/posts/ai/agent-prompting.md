---
title: 에이전트 프롬프트를 잘 작성한다는게 뭘까?  
date: 2026-08-23
updated: 2026-08-23
tags:
  - ai
  - 프롬프팅
---

"좋은 프롬프트를 쓰는 법"보다 "에이전트가 언제 생각하고, 언제 행동하고, 무엇으로 성공을 판단할지 설계하는 법"

## 절차 대신 목표·제약·성공 조건 주기

2026-08 기준 OpenAI 가이드는 모델이 사용자의 의도를 꽤 잘 추론하므로 모든 절차를 지정할 필요는 없다고 봄. 대신 아래 네 가지가 중요.

- domain context
  - 모델이 알 도리가 없는 전제를 미리 줌. `DB의 시간은 전부 EST 24시간제` 같은 것
- hard constraints
  - 어기면 안 되는 선. `주문 변경 툴은 한 번만 호출 가능` 처럼 위반 시 작업 자체가 틀어지는 것
- approval boundary
  - 이 요청이 어디까지 허용하는지의 경계. 외부 쓰기·파괴적 작업·결제·범위 확장 앞에서는 멈추고 확인받게 하되, 그 안쪽 작업은 묻지 말고 진행하게
- success criteria
  - 무엇을 근거로 끝났다고 볼지. `기존 테스트 통과`, `LCP 악화 없음`처럼 검증 가능한 형태로

같은 요청이라도 이렇게 갈림.

- 나쁨: `A 읽고 B 읽고 C 고쳐`
- 좋음: `렌더링 성능을 개선해. public API 변경 금지. 기존 테스트 통과 + LCP 악화 없음이 성공 조건.`

## 에이전트의 기본 행동 모드는 규칙으로 박을 수 있음

Anthropic 문서에서 특히 유용한 부분. 질문하면 분석만 하고 명시적으로 시켜야 수정하는 보수적 모드와, 의도가 충분하면 바로 수정하는 자율적 모드를 명시적으로 설계 가능.

즉 지금 쓰는 패턴을 아예 규칙으로 만들 수 있음.

> 질문/검토 단계에서는 파일을 변경하지 마라. 내가 구현·수정·적용을 명시했을 때만 변경하라.

그러면 매번 의문문이냐 명령문이냐를 신경 쓸 필요가 줄어듦.

## "하지 마" 뒤에 "왜"를 붙이면 규칙이 일반화됨

단순히 `X 하지 마`보다 `X는 기존 API 사용자에게 breaking change가 되므로 하지 마`가 더 효과적. Anthropic은 instruction의 motivation/context를 설명하면 모델이 규칙을 더 잘 일반화한다고 권장.

## 예시 2~5개가 장황한 설명보다 강함

원하는 코드 리뷰나 결과 형태가 있다면 설명을 늘리는 것보다 좋은 예시 2~5개가 효과적. Anthropic은 예시를 output format·tone·structure를 조절하는 가장 신뢰도 높은 방법 중 하나로 봄.

특히 AGENTS.md 등에 아래를 넣는 것이 상당히 강력함.

- 좋은 PR 예
- 허용되는 refactoring
- 하면 안 되는 변경

## 긴 context에서는 질문을 맨 뒤로

Anthropic은 20k+ token 입력에서 자료 → context → 실제 질문 순서를 권장하며, 자사 테스트에서 query를 뒤에 놓았을 때 최대 30% 개선됐다고 설명. ACL 연구도 별도로 긴 input 뒤에 instruction을 배치하면 instruction forgetting을 줄일 수 있다는 결과를 보고했음.

그래서 큰 코드베이스 작업에서는 이런 구조가 꽤 합리적.

```text
[코드/로그/현재 상황]

위 내용을 기준으로 판단해.

최종 작업:
문제 원인을 고치되 public API는 변경하지 마.
테스트까지 실행해서 검증해.
```

## "더 철저히 해"는 오히려 역효과

최신 모델은 원래 탐색과 reasoning을 많이 하는 편이라 `철저하게 조사해`, `가능성을 모두 확인해` 같은 blanket instruction을 많이 넣으면 쓸데없는 파일 탐색과 과도한 검증이 생길 수 있음. Anthropic도 이런 over-prompting을 줄이라고 권장.

## 프롬프트도 코드처럼 eval하기

OpenAI가 꽤 강하게 권하는 부분.

1. 잘 작동하는 prompt에서 시작
2. instruction 하나를 제거
3. 동일한 eval 실행
4. 성능 변화 확인

그리고 동일한 instruction을 반복하지 말라고 함.

## 결국 이 순서

Context → 탐색/질문 → 결정 → 최종 작업 → 제약 → 성공 조건 → 검증

특히 마지막 명령문 습관은 유지할 가치가 있는데, 더 발전시키려면 단순히 `수정해`가 아니라 **무엇을 / 어디까지 / 무엇을 건드리지 말고 / 어떻게 검증할지**를 마지막에 압축해서 선언하는 쪽이 훨씬 효과적.

## 참고

- [OpenAI Model Guidance](https://developers.openai.com/api/docs/guides/prompt-guidance) — domain context / hard constraints / approval boundary / success criteria 4요소, prompt eval 방법론, instruction 중복 금지
- [GPT-5 Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide) — 위 4요소의 실제 프롬프트 예시. domain context·hard constraints·approval boundary 예문 출처
- [Anthropic Prompting Best Practices](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices) — 행동 모드 설계, motivation 설명, 예시 우선, long context 배치
- [Instruction Position Matters in Sequence Generation with Large Language Models](https://aclanthology.org/2024.findings-acl.693/) — Findings of ACL 2024. 긴 input 뒤에 instruction을 두면 instruction forgetting이 줄어든다
