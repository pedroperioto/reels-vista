# Narração no Google AI Studio (grátis)

O usuário grava; o Claude entrega o texto pronto e depois sincroniza tudo com o WAV.

## O que mandar ao usuário
1. **Onde:** aistudio.google.com → *Generate speech* → **Single-speaker**.
2. **Voz:** sempre a mesma em vídeos da mesma série. Sugestões: **Charon** (informativa) ou **Sadaltager** (de quem entende).
3. **Bloco de estilo** (campo de estilo / Voice design), curto e descritivo. Exemplo:
   > Narrador brasileiro, sotaque paulistano, 35 anos, voz de apresentador de notícia que conta histórias. Confiante e
   > envolvente, com um sorriso discreto na voz. Começa com leve suspense, acelera nas notícias e desacelera nos números
   > importantes. Palavras em MAIÚSCULAS recebem ênfase forte. Nas falas dos personagens, muda o tom (…). No final, tom
   > próximo e convidativo.
4. **Texto**, um parágrafo por cena, com as marcações **em inglês entre `< >`**: `<short pause>`, `<long pause>`,
   `<chuckle>`, `<sigh>`, `<tsk>`, `<breath>`, `<whispers>`. Em algumas versões do AI Studio elas são entre `[ ]`.
5. **Dicas:** números por extenso ("cinquenta e um vírgula oito"); MAIÚSCULAS só em 3–6 palavras-chave; termo em inglês
   que sair aportuguesado, escrever como se fala ("sârkit brêiker"); gerar tudo de uma vez e baixar em **WAV**, sem música;
   se cortar por tamanho, dividir em 2 partes num ponto de cena e mandar as duas.

## Ritmo
- O Gemini fala ~2,5 palavras/s com as pausas: 315 palavras deram 2min05. Para ~60 s, ~150 palavras.

## Quando o WAV chega
- Salve como `voz/bruto_original.wav`. Crie `voz/texto.txt` com o texto **sem** as marcações (só palavras e pontuação).
- `python3 SKILL_DIR/scripts/alinhar.py <projeto>` → `voz/bruto.wav` (regravado: o cabeçalho do AI Studio às vezes é
  inválido para o scipy) e `voz/palavras.json` ([palavra, início, fim]). Confira o relatório de desvios.
- Duas partes: junte com ffmpeg (`concat`) antes de alinhar, com ~0,4 s de silêncio entre elas.
