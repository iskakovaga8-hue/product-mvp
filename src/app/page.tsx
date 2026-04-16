import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold-dark rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
            20 лет строили чужие компании.
            <br />
            <span className="text-gold">Пора построить свою практику</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Персональная программа Ольги Полднер для директоров и
            топ-менеджеров: упаковка экспертизы в продукт, выход на рынок,
            первые клиенты. Без «прыжка в пустоту» — с системой и
            сопровождением.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-navy font-heading font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Пройти экспресс-аудит экспертизы →
            </Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm text-gray-400">
            <div>
              <span className="text-2xl font-heading font-bold text-gold block">
                17+
              </span>
              лет в консалтинге
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-gold block">
                8 000+
              </span>
              консультаций
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-gold block">
                1 100+
              </span>
              офферов для клиентов
            </div>
          </div>
        </div>
      </section>

      {/* Aha moment */}
      <section className="py-20 px-6 bg-navy-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-4">
            Узнайте свой потенциал за 15 минут
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Прежде чем принимать решения — посмотрите на свой опыт под новым
            углом. Пройдите бесплатную диагностику и получите карту
            компетенций с персональными рекомендациями.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
            <div className="bg-navy-medium rounded-2xl p-6 border border-gold/20">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-gold text-xl">✓</span>
              </div>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">
                Диагностика экспертизы
              </h3>
              <p className="text-gray-400">
                За одну сессию покажем, какие из ваших компетенций уже сейчас
                можно продавать как консалтинг. Вы увидите карту своих сильных
                сторон.
              </p>
            </div>
            <div className="bg-navy-medium rounded-2xl p-6 border border-gold/20">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-gold text-xl">✓</span>
              </div>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">
                Аудит позиционирования
              </h3>
              <p className="text-gray-400">
                Проанализируем, как вас видит рынок и как отстроиться от
                тысяч «бизнес-консультантов» — за счёт конкретного отраслевого
                опыта.
              </p>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-navy font-heading font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Пройти бесплатную диагностику →
          </Link>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-12 text-center">
            Результаты, которые можно измерить
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Упакованный консалтинговый продукт",
                desc: "Описание, цена, целевой клиент. Потенциальный заказчик за 2 минуты понимает, что получит и сколько это стоит.",
              },
              {
                title: "Публичное присутствие",
                desc: "Профиль в LinkedIn и Telegram, минимум 2 публикации, контент-план. Клиенты находят вас сами.",
              },
              {
                title: "3+ первых платящих клиента",
                desc: "Реальные проекты и живые деньги, а не «когда-нибудь начну».",
              },
              {
                title: "Доход ≥50% от прежнего в найме",
                desc: "К концу программы вы видите, что практика жизнеспособна и масштабируема.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-navy-light rounded-2xl p-6 border border-gold/20 hover:border-gold/40 transition-colors"
              >
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mb-4">
                  <span className="text-navy font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-6 bg-navy-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-4 text-center">
            Узнаёте себя?
          </h2>
          <p className="text-lg text-gray-300 text-center mb-10">
            Вы хотите наконец работать на себя — или продолжать строить чужие
            компании?
          </p>
          <div className="space-y-4">
            {[
              "Устали от корпоративных реорганизаций — каждый год новый CEO, новая стратегия, всё сначала?",
              "Чувствуете, что переросли должность, но следующей ступени не видно?",
              "Знакомые просят совета по бизнесу — и вы понимаете, что это уже консалтинг, просто бесплатный?",
              "Задумываетесь об уходе, но страшно: ипотека, семья, привычный уровень жизни?",
              "Видите, как менее опытные коллеги уже работают на себя — и думаете: «У меня-то точно получится»?",
              "Просыпаетесь с мыслью «не хочу туда ехать» — но не понимаете, куда идти вместо?",
            ].map((pain, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-navy-medium rounded-xl p-4 border border-gold/10"
              >
                <span className="text-gold font-bold text-lg mt-0.5">
                  ✓
                </span>
                <p className="text-gray-300">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-12 text-center">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Упаковать опыт в продукт",
                items: [
                  "Аудит экспертизы → карта компетенций",
                  "1–3 консалтинговых предложения с ценой",
                  "Обоснованное ценообразование",
                ],
              },
              {
                num: "2",
                title: "Найти первых клиентов",
                items: [
                  "Стратегия выхода на рынок",
                  "Нетворк Ольги — тёплые рекомендации",
                  "Сопровождение первых сделок",
                ],
              },
              {
                num: "3",
                title: "Выстроить личный бренд",
                items: [
                  "Позиционирование и отстройка",
                  "LinkedIn, Telegram, 2+ публикации",
                  "Контент-стратегия для входящих запросов",
                ],
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <span className="text-navy font-heading font-bold text-2xl">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <ul className="space-y-2 text-left">
                  {step.items.map((item, i) => (
                    <li key={i} className="text-gray-400 flex items-start gap-2 text-sm">
                      <span className="text-gold mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objections */}
      <section className="py-20 px-6 bg-navy-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-10 text-center">
            У вас есть сомнения?
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "«А вдруг я не смогу продавать себя?»",
                a: "Мы не учим «продавать». Мы упаковываем ваш реальный опыт так, что клиенты сами видят ценность. Плюс доступ к нетворку Ольги — тёплые контакты вместо холодных звонков.",
              },
              {
                q: "«А если я пойму, что консалтинг — не моё?»",
                a: "Гибкий формат: если вы получите сильный оффер или передумаете — оставшуюся часть переключим на карьерный рост в найме. Без доплаты.",
              },
              {
                q: "«Это дорого — а вдруг не окупится?»",
                a: "Средняя ставка независимого топ-консультанта — от 150 000 ₽ за проект. Программа окупается за 2–3 проекта. А цель — минимум 3 платящих клиента к финалу.",
              },
            ].map((obj, i) => (
              <div
                key={i}
                className="bg-navy-medium rounded-2xl p-6 border border-gold/20"
              >
                <h3 className="font-heading font-semibold text-gold text-lg mb-3">
                  {obj.q}
                </h3>
                <p className="text-gray-300 leading-relaxed">{obj.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-4 text-center">
            Формат работы и стоимость
          </h2>
          <p className="text-center text-gray-400 mb-10">
            ВСЕ консультации проводятся <span className="text-gold font-semibold">ТОЛЬКО ЛИЧНО</span> Ольгой Полднер
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-navy-light rounded-2xl p-8 border-2 border-gold/30 hover:border-gold/60 transition-colors">
              <h3 className="font-heading font-bold text-xl text-white mb-4">
                Группа (мастермайнд)
              </h3>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex gap-2">
                  <span className="text-gold">•</span> 3–5 участников, все — топ-менеджеры
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> 2 групповые сессии в месяц (90 мин.)
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> 1 индивидуальная сессия в месяц (60 мин.)
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> Чат поддержки группы в Telegram
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> Длительность: 4 месяца
                </li>
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full border-2 border-gold text-gold hover:bg-gold hover:text-navy font-heading font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Обсудить формат →
              </Link>
            </div>
            <div className="bg-navy-light rounded-2xl p-8 border-2 border-gold relative shadow-lg shadow-gold/10">
              <div className="absolute -top-3 right-6 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
                Популярный
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-4">
                Индивидуальное сопровождение
              </h3>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex gap-2">
                  <span className="text-gold">•</span> 4 индивидуальные сессии в месяц (60 мин.)
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> Асинхронная поддержка в Telegram
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> Доступ к нетворку Ольги
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> Длительность: 6 месяцев
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span> Первые клиенты уже в процессе
                </li>
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full bg-gold hover:bg-gold-light text-navy font-heading font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                Начать с диагностики →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Olga */}
      <section className="py-20 px-6 bg-navy-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-6">
            Об авторе программы
          </h2>
          <div className="bg-navy-medium rounded-2xl p-8 border border-gold/20">
            <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-heading font-bold text-navy">
                ОП
              </span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">
              Ольга Полднер
            </h3>
            <p className="text-gray-400 mb-4">
              Карьерный консультант для топ-менеджеров
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
              <span className="bg-gold/10 text-gold px-4 py-2 rounded-full font-medium border border-gold/30">
                17+ лет в консалтинге
              </span>
              <span className="bg-gold/10 text-gold px-4 py-2 rounded-full font-medium border border-gold/30">
                8 000+ консультаций
              </span>
              <span className="bg-gold/10 text-gold px-4 py-2 rounded-full font-medium border border-gold/30">
                1 100+ офферов
              </span>
            </div>
            <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">
              Ольга знает рынок найма топ-менеджеров как никто: кто кого ищет,
              сколько платят, что ценят. Теперь эта экспертиза — на вашей
              стороне. Не чтобы найти работу, а чтобы перестать её искать.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Готовы узнать свой потенциал?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Пройдите бесплатную диагностику экспертизы за 15 минут и получите
            персональную карту компетенций с рекомендациями.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-navy font-heading font-bold text-lg px-10 py-5 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Пройти экспресс-аудит экспертизы →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-gray-500 py-8 px-6 border-t border-gold/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 Ольга Полднер. Программа «Из найма в консалтинг»</p>
          <div className="flex gap-6">
            <a href="https://t.me/OlgaPoldner" className="hover:text-gold transition-colors">
              Telegram
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
