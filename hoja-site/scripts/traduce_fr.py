# -*- coding: utf-8 -*-
"""Passe globale ES->FR des chaines partafees + pages curso-ia/empresas/contacto/registration."""
import re
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")

T = {
 # ---------- chaines globales (footer inline, chrome, templates) ----------
 " es una academia online que ofrece formación personalizada en tiempo real mediante videollamadas. La academia busca brindar una experiencia educativa de alto nivel, enfocada en garantizar que los alumnos obtengan el máximo provecho en un corto periodo de tiempo.":
   " est une académie en ligne qui propose des formations personnalisées en intelligence artificielle, dispensées en temps réel. L'académie s'engage à offrir une expérience éducative de haut niveau pour garantir à chaque apprenant les meilleurs résultats en un minimum de temps.",
 "es una academia online que ofrece formación personalizada en tiempo real mediante videollamadas. La academia busca brindar una experiencia educativa de alto nivel, enfocada en garantizar que los alumnos obtengan el máximo provecho en un corto periodo de tiempo.":
   "est une académie en ligne qui propose des formations personnalisées en intelligence artificielle, dispensées en temps réel. L'académie s'engage à offrir une expérience éducative de haut niveau pour garantir à chaque apprenant les meilleurs résultats en un minimum de temps.",
 "Chatea con nosotros, ¡estamos online!": "Discutez avec nous, nous sommes en ligne !",
 "Ir al contenido": "Aller au contenu",
 "Alternar menú": "Basculer le menu",
 "Política de Privacidad, términos y condiciones": "Politique de Confidentialité & Conditions",
 "Política de Privacidad de Google": "Politique de confidentialité de Google",
 "Política de Cookies": "Politique des Cookies",
 "Programa de Afiliados": "Programme Partenaires & Affiliation",
 "Ver testimonios": "Voir les témoignages",
 "Lo que dicen nuestros alumnos": "Ce que disent nos apprenants",
 "Experiencias reales de personas que ya han pasado por la formación": "Expériences réelles de personnes qui ont déjà suivi la formation",
 " en cada edición": " par édition",
 "1ª Edición – Online": "1ʳᵉ édition – En ligne",
 "2ª Edición – Online": "2ᵉ édition – En ligne",
 "3ª Edición – Online": "3ᵉ édition – En ligne",
 "4ª Edición – Online": "4ᵉ édition – En ligne",
 "5ª Edición – Online": "5ᵉ édition – En ligne",
 "Alumnos de la primera edición del Programa Intensivo de Inteligencia Artificial Generativa de HOJA ACADEMY":
   "Apprenants de la première édition du Programme Intensif d'Intelligence Artificielle Générative de HOJA ACADEMY",
 "Alumnos de la segunda edición del Programa Intensivo de Inteligencia Artificial Generativa de HOJA ACADEMY":
   "Apprenants de la deuxième édition du Programme Intensif d'Intelligence Artificielle Générative de HOJA ACADEMY",
 "Alumnos de la tercera edición del Programa Intensivo de Inteligencia Artificial Generativa de HOJA ACADEMY":
   "Apprenants de la troisième édition du Programme Intensif d'Intelligence Artificielle Générative de HOJA ACADEMY",
 "Alumnos de la cuarta edición del Programa Intensivo de Inteligencia Artificial Generativa de HOJA ACADEMY":
   "Apprenants de la quatrième édition du Programme Intensif d'Intelligence Artificielle Générative de HOJA ACADEMY",
 "Alumnos de la quinta edición del Programa Intensivo de Inteligencia Artificial Generativa de HOJA ACADEMY":
   "Apprenants de la cinquième édition du Programme Intensif d'Intelligence Artificielle Générative de HOJA ACADEMY",
 "Yago — Músico y nutricionista": "Yago — Musicien et nutritionniste",
 "“Me ha servido muchísimo para avanzar en lo que quiero hacer.”": "« Cela m'a énormément servi pour avancer dans ce que je veux faire. »",
 "“Ahora hago cosas que para otros están a años luz.”": "« Maintenant, je fais des choses qui sont hors de portée pour d'autres. »",
 "“Ahora aporto ideas en mi empresa que antes ni me planteaba.”": "« Maintenant, j'apporte dans mon entreprise des idées que je n'envisageais même pas avant. »",
 "Sector multiservicios": "Secteur multiservices",
 "construcción": "construction",
 "“A nosotros nos ha cambiado la vida laboral.”": "« Pour nous, cela a changé notre vie professionnelle. »",
 "Grupos reducidos": "Groupes réduits",
 "Sesiones en directo con alumnos reales, donde el seguimiento y la cercanía marcan la diferencia.":
   "Séances en direct avec de vrais apprenants, où le suivi et la proximité font la différence.",
 "Mira las opiniones de nuestros alumnos": "Découvrez les avis de nos apprenants",
 "y te responderemos en menos de 48 horas": "et nous vous répondrons en moins de 48 heures",
 "el email exclusivo de alumnos": "l'email réservé aux apprenants",
 "desplegado al abrir esta página.": "affiché à l'ouverture de cette page.",
 # ---------- curso-ia ----------
 "Inteligencia Artificial": "Intelligence Artificielle",
 "Duración": "Durée",
 "8 Semanas": "8 Semaines",
 "+65 Horas": "+65 Heures",
 "Acceso a curso, Grabaciones y recursos ¡por siempre!": "Accès au cours, enregistrements et ressources, à vie !",
 "Esta edición": "Cette édition",
 "Dossier de curso": "Dossier de formation",
 "Descargar dossier": "Télécharger le dossier",
 "¿Qué aprenderás?": "Que allez-vous apprendre ?",
 "Aprenderás a entender, elegir y aplicar la inteligencia artificial en cualquier proyecto.":
   "Vous apprendrez à comprendre, choisir et appliquer l'intelligence artificielle dans n'importe quel projet.",
 "Certificado propio": "Certificat propre",
 "Certificado": "Certificat",
 "Podrás cancelar su suscripción en cualquier momento": "Vous pourrez annuler votre abonnement à tout moment",
 "No aprenderás una única herramienta.": "Vous n'apprendrez pas un seul outil.",
 "aplicar la IA con sentido.": "appliquer l'IA à bon escient.",
 "Algunos de los aspectos que más se repiten en las opiniones sobre nuestras formaciones.":
   "Les aspects les plus récurrents des avis sur nos formations.",
 "La experiencia de nuestros alumnos, reflejada en más de 100 opiniones.":
   "L'expérience de nos apprenants, reflétée dans plus de 100 avis.",
 "PROYECTOS PRÁCTICOS": "PROJETS PRATIQUES",
 "tutor principal del curso": "tuteur principal du cours",
 "Fundamentos de la IA": "Fondamentaux de l'IA",
 "Aprende cómo funciona realmente la inteligencia artificial generativa para desarrollar criterio y adaptarte a cualquier herramienta o modelo que aparezca.":
   "Comprenez comment fonctionne réellement l'IA générative pour développer votre discernement et vous adapter à tout outil ou modèle à venir.",
 "Domina ChatGPT, Gemini, Claude y otros modelos. Diseña prompts avanzados y crea asistentes personalizados adaptados a cualquier necesidad.":
   "Maîtrisez ChatGPT, Gemini, Claude et d'autres modèles. Concevez des prompts avancés et créez des assistants personnalisés pour tous vos besoins.",
 "Crea imágenes, audio, vídeo y avatares con IA. Desde la generación de contenido hasta la edición, clonación de voz y producción audiovisual":
   "Créez images, audio, vidéo et avatars avec l'IA. De la génération de contenu à l'édition, au clonage vocal et à la production audiovisuelle",
 "Explicaciones claras y fáciles de seguir": "Des explications claires et faciles à suivre",
 "Se valora especialmente la forma de explicar conceptos y herramientas de inteligencia artificial de manera sencilla y comprensible.":
   "La façon d'expliquer les concepts et les outils d'intelligence artificielle de manière simple et compréhensible est particulièrement appréciée.",
 "Un enfoque realmente práctico": "Une approche vraiment pratique",
 "Los ejemplos y casos de uso permiten entender cómo aplicar lo aprendido a situaciones reales desde el primer momento.":
   "Les exemples et cas d'usage permettent de comprendre comment appliquer ce qui est appris à des situations réelles dès le premier moment.",
 "Contenido útil y actualizado": "Un contenu utile et à jour",
 "Otro de los aspectos más valorados es trabajar con herramientas, metodologías y aplicaciones actuales.":
   "Un autre aspect très apprécié : travailler avec des outils, méthodologies et applications actuels.",
 "ACCESO EN DIRECTO": "ACCÈS EN DIRECT",
 "Podrás acceder a tus clases en directo por videollamada 2 veces a la semana para aprender todo, en SOLO 8 semanas.":
   "Vous suivrez vos cours en visioconférence 2 fois par semaine pour tout apprendre, en SEULEMENT 8 semaines.",
 "Al finalizar la clase en directo esta se quedará grabada en la plataforma para que puedas acceder a ella las 24/7 por siempre.":
   "À la fin du cours en direct, l'enregistrement reste sur la plateforme pour un accès 24h/24 et 7j/7, à vie.",
 "RESÚMENES y RECURSOS": "RÉSUMÉS et RESSOURCES",
 "Además de la grabación se incluirán otros materiales como puntos clave de la clase y recursos adicionales para que tu aprendizaje sea lo más sencillo posible.":
   "En plus de l'enregistrement, d'autres matériaux sont inclus : points clés du cours et ressources complémentaires pour rendre votre apprentissage aussi simple que possible.",
 "A través de nuestras clases de temario, descubrirás los conceptos de la IA Generativa, con un enfoque práctico y directo en las últimas novedades de la IA":
   "À travers nos cours théoriques, vous découvrirez les concepts de l'IA générative, avec une approche pratique et directe sur les dernières nouveautés de l'IA",
 "Cada semana, tendrás la oportunidad de poner en práctica lo aprendido en un taller específico, diseñado para aplicar todo lo que veamos en clase.":
   "Chaque semaine, vous mettrez en pratique ce qui a été appris dans un atelier spécifique, conçu pour appliquer tout ce que nous voyons en cours.",
 "APRENDER": "APPRENDRE",
 "Veremos IAs sin convenios con terceros, todas disponibles en versiones gratuitas para que puedas seguir explorando y profundizando más allá del curso.":
   "Nous utiliserons des IA sans accords avec des tiers, toutes disponibles en version gratuite, pour continuer à explorer au-delà du cours.",
 "Al finalizar las 8 semanas, habrás recorrido todo el proceso de forma práctica y contarás con una base sólida para seguir aplicando la IA Generativa en tu día a día profesional.":
   "À la fin des 8 semaines, vous aurez parcouru tout le processus de façon pratique et disposerez d'une base solide pour continuer à appliquer l'IA générative dans votre quotidien professionnel.",
 " Acceso y duración del programa ": " Accès et durée du programme ",
 " Flexibilidad y compatibilidad con el trabajo ": " Flexibilité et compatibilité avec le travail ",
 " Profesores y herramientas ": " Formateurs et outils ",
 "Accede a una cuenta Make Core individualizada durante 6 meses, con 150k créditos mensuales, un beneficio valorado en más de 600€.":
   "Accédez à un compte Make Core individuelle pendant 6 mois, avec 150 000 crédits mensuels, un avantage estimé à plus de 600 €.",
 "Utiliza ChatGPT Plus sin coste adicional mientras realizas el curso, para acelerar tu aprendizaje, tus tareas y tus proyectos reales.":
   "Profitez de ChatGPT Plus sans coût supplémentaire pendant toute la durée du cours pour accélérer votre apprentissage, vos tâches et vos projets réels.",
 "Además del acompañamiento continuo de Alejavi Rivera y el equipo durante todo el curso, incluimos una sesión privada al finalizar para resolver cualquier consulta adicional y asegurar que avanzas con total claridad y seguridad.":
   "En plus de l'accompagnement continu d'Alejavi Rivera et de l'équipe pendant tout le cours, nous incluons une session privée à la fin pour résoudre toute question et avancer avec une totale clarté.",
 "Nuestro curso de Inteligencia Artificial Generativa está diseñado para que domines las herramientas que están transformando el mundo laboral. Aprende con un enfoque práctico y adquiere conocimientos reales y aplicables.":
   "Notre cours d'Intelligence Artificielle Générative est conçu pour que vous maîtrisiez les outils qui transforment le monde du travail. Apprenez de façon pratique et acquérez des connaissances réelles et applicables.",
 "Formación en IA Generativa en directo y en grupos reducidos, donde el seguimiento y la cercanía marcan la diferencia.":
   "Formation en IA générative en direct et en groupes réduits, où le suivi et la proximité font la différence.",
 "Lo que más valoran nuestros alumnos": "Ce que nos apprenants apprécient le plus",
 "(*coste de tramitación no incluida": "(frais de délivrance non compris",
 "Alejavi Rivera es un referente en la divulgación y enseñanza de la inteligencia artificial. En los últimos tres años, ha compartido contenido práctico en YouTube sobre IA, logrando de forma orgánica y sin inversión publicitaria, llegar a más de 30 millones de visualizaciones, con un una buena acogida del 99.2% de likes en sus vídeos.":
   "Alejavi Rivera est une référence en vulgarisation et enseignement de l'intelligence artificielle. Ces trois dernières années, il a partagé du contenu pratique sur YouTube autour de l'IA, atteignant de façon organique, sans investissement publicitaire, plus de 30 millions de vues, avec un taux d'appréciation de 99,2 % de likes sur ses vidéos.",
 "Desde 2019, antes del boom de herramientas como ChatGPT, Alejavi ya trabajó en puestos directivos liderando proyectos de digitalización e IA en colaboración con empresas reales. Su experiencia y capacidad para acercar la tecnología a las personas lo convierten en un una persona clave en este campo.":
   "Depuis 2019, avant l'essor d'outils comme ChatGPT, Alejavi occupait déjà des postes de direction en pilotant des projets de digitalisation et d'IA avec des entreprises réelles. Son expérience et sa capacité à rapprocher la technologie des personnes font de lui un acteur clé de ce domaine.",
 "Jose Moral es un apasionado de los negocios digitales y la automatización aplicada al crecimiento de empresas. Desde 2021 trabaja activamente en la implementación y desarrollo de estrategias de automatización impulsadas por inteligencia artificial, optimizando procesos de captación, conversión y fidelización de clientes.":
   "Jose Moral est passionné de business digitaux et d'automatisation appliquée à la croissance des entreprises. Depuis 2021, il met en œuvre et développe des stratégies d'automatisation portées par l'intelligence artificielle, en optimisant les processus d'acquisition, de conversion et de fidélisation clients.",
 "Ha trabajado en proyectos de automatización con empresas como Bizum, Realia y Grupo Giunti, entre otras, trasladando la complejidad técnica a soluciones aplicables y escalables en entornos reales de negocio.":
   "Il a travaillé sur des projets d'automatisation avec des entreprises comme Bizum, Realia et Grupo Giunti, entre autres, en transformant la complexité technique en solutions applicables et évolutives dans des environnements réels.",
 "impartiendo la mayor parte de la formación y guiando a los alumnos a lo largo de todo el programa. Puedes ver la trayectoria de Alejavi Rivera en":
   "en dispensant la majeure partie de la formation et en accompagnant les apprenants tout au long du programme. Vous pouvez voir le parcours d'Alejavi Rivera sur",
 "la posibilidad de tramitar un certificado Universitario en Inteligencia Artificial de la Universidad Isabel I que además cuenta con 2 créditos ECTS.*":
   "la possibilité d'obtenir un certificat universitaire en Intelligence Artificielle de l'Universidad Isabel I, valant également 2 crédits ECTS.*",
 "Comprenderás los conceptos esenciales de la IA Generativa para construir una base sólida y entender no solo cómo utilizar las herramientas, sino también cómo funcionan y cuándo conviene utilizar cada una.":
   "Vous comprendrez les concepts essentiels de l'IA générative pour bâtir une base solide et saisir non seulement comment utiliser les outils, mais aussi comment ils fonctionnent et quand employer chacun d'eux.",
 "Aprenderás a utilizar una amplia gama de herramientas de IA para casos de uso específicos, desde la generación de texto hasta la creación de contenido multimedia.":
   "Vous apprendrez à utiliser un large éventail d'outils d'IA pour des cas d'usage spécifiques, de la génération de texte à la création de contenu multimédia.",
 "Pondrás en práctica lo aprendido mediante ejercicios y proyectos reales, desarrollando habilidades que podrás trasladar directamente a tu trabajo, negocio o proyectos personales.":
   "Vous mettrez en pratique ce qui a été appris grâce à des exercices et des projets réels, en développant des compétences directement transposables à votre travail, votre activité ou vos projets personnels.",
 "Conocer herramientas como ChatGPT, Gemini, Claude o Make es importante, pero el verdadero valor está en saber elegirlas, combinarlas y aplicarlas según cada necesidad. El objetivo no es aprender una herramienta concreta, sino desarrollar el criterio para utilizar la IA de forma práctica y adaptarte a su evolución.":
   "Connaître des outils comme ChatGPT, Gemini, Claude ou Make est important, mais la vraie valeur réside dans le fait de savoir les choisir, les combiner et les appliquer selon chaque besoin. L'objectif n'est pas d'apprendre un outil précis, mais de développer le discernement pour utiliser l'IA de façon pratique et vous adapter à son évolution.",
 # ---------- empresas ----------
 "FORMACIÓN PARA EMPRESAS": "FORMATION POUR ENTREPRISES",
 "Inteligencia Artificial para empresas": "Intelligence Artificielle pour entreprises",
 "Formación en IA para empresas pensada para tu equipo.": "Formation en IA pour entreprises, pensée pour votre équipe.",
 "Solicitar información": "Demander des informations",
 "Soluciones de formación para empresas": "Solutions de formation pour entreprises",
 "Tres soluciones de formación en IA para empresas:": "Trois solutions de formation en IA pour entreprises :",
 "en directo, a tu ritmo o a medida": "en direct, à votre rythme ou sur mesure",
 "FORMACIÓN EN DIRECTO": "FORMATION EN DIRECT",
 "Diseñamos la formación según las necesidades de tu equipo y, de esta forma, adaptamos contenidos, duración y formato para lograr un impacto real en tu empresa.":
   "Nous concevons la formation selon les besoins de votre équipe et adaptons contenus, durée et format pour un impact réel dans votre entreprise.",
 "FORMACIÓN A TU RITMO": "FORMATION À VOTRE RYTHME",
 "FORMACIÓN A MEDIDA": "FORMATION SUR MESURE",
 "Formación en IA para empresas bonificable por FUNDAE": "Formation en IA pour entreprises éligible au financement FUNDAE",
 "recuperar parte del coste de la formación.": "récupérer une partie du coût de la formation.",
 "El Programa Intensivo de IA Generativa es bonificable": "Le Programme Intensif d'IA Générative est éligible au financement",
 "reduciendo el coste de la formación.": "en réduisant le coût de la formation.",
 "Por qué elegir HOJA ACADEMY": "Pourquoi choisir HOJA ACADEMY",
 "Nuestro enfoque es práctico y orientado a resultados. De esta forma, los equipos integran herramientas de IA en su día a día y obtienen mejoras reales desde el primer momento.":
   "Notre approche est pratique et orientée résultats. Ainsi, les équipes intègrent des outils d'IA dans leur quotidien et obtiennent des améliorations réelles dès le départ.",
 "EQUIPO DOCENTE": "ÉQUIPE PÉDAGOGIQUE",
 "Formación impartida por expertos en IA aplicada": "Formation dispensée par des experts en IA appliquée",
 "Alejavi Rivera lidera la formación principal del programa, acompañado por especialistas en automatización y aplicación real de la inteligencia artificial en empresa.":
   "Alejavi Rivera pilote la formation principale du programme, entouré de spécialistes en automatisation et en application concrète de l'IA en entreprise.",
 "¿Qué formación encaja mejor con tu equipo?": "Quelle formation correspond le mieux à votre équipe ?",
 "Además, si buscas algo más específico": "Et si vous cherchez quelque chose de plus spécifique",
 "✔ Más de 700 profesionales": "✔ Plus de 700 professionnels",
 "Formación adaptada a tu equipo": "Formation adaptée à votre équipe",
 ", por lo que puedes formar a tu equipo en IA aplicada": ", vous pouvez donc former votre équipe à l'IA appliquée",
 "Descubre por qué cada vez más empresas confían en HOJA ACADEMY": "Découvrez pourquoi de plus en plus d'entreprises font confiance à HOJA ACADEMY",
 "Además, tu equipo no será un alumno más: contará con un seguimiento cercano durante todo el programa para asegurar una evolución real y aplicable en su trabajo.":
   "De plus, votre équipe ne sera pas un apprenant de plus : elle bénéficiera d'un suivi rapproché pendant tout le programme pour garantir une évolution réelle et applicable au travail.",
 "Analizamos tus necesidades y te orientamos para elegir la opción más adecuada.": "Nous analysons vos besoins et vous orientons vers l'option la plus adaptée.",
 "valoramos contigo una formación a medida.": "nous étudions ensemble une formation sur mesure.",
 "Clases en directo con acompañamiento": "Cours en direct avec accompagnement",
 "Aplicación práctica desde el primer día": "Application pratique dès le premier jour",
 "Bonificable a través de FUNDAE": "Éligible au financement FUNDAE",
 "Diseño personalizado según el nivel y necesidades del equipo": "Conception personnalisée selon le niveau et les besoins de l'équipe",
 "Formación orientada a procesos reales de la empresa": "Formation orientée vers des processus réels de l'entreprise",
 "Formato adaptable (online o presencial)": "Format adaptable (en ligne ou en présentiel)",
 "Automatiza tareas, optimiza procesos y, además, mejora la productividad en tu día a día con Inteligencia Artificial.":
   "Automatisez des tâches, optimisez des processus et améliorez votre productivité quotidienne grâce à l'intelligence artificielle.",
 "Integra la IA de Google en tu trabajo diario y mejora así la toma de decisiones con herramientas avanzadas.":
   "Intégrez l'IA de Google à votre travail quotidien et améliorez la prise de décision avec des outils avancés.",
 "Automatiza procesos, conecta herramientas y, de esta forma, elimina tareas repetitivas sin necesidad de programar.":
   "Automatisez des processus, connectez des outils et éliminez les tâches répétitives sans programmer.",
 "Programa intensivo con aplicación práctica en el trabajo": "Programme intensif avec application pratique au travail",
 "Bonificable para trabajadores por cuenta ajena": "Éligible pour les salariés",
 "Acompañamiento durante todo el proceso": "Accompagnement tout au long du processus",
 "Formación práctica": "Formation pratique",
 "Aplicamos la inteligencia artificial a casos reales de empresa desde el primer día.":
   "Nous appliquons l'intelligence artificielle à des cas réels d'entreprise dès le premier jour.",
 "Trabajamos con las herramientas más actuales del mercado y en constante evolución.":
   "Nous travaillons avec les outils les plus actuels du marché, en constante évolution.",
 "Aplicación directa": "Application directe",
 "De este modo, tu equipo aprende a implementar la IA en marketing, ventas y procesos internos.":
   "Ainsi, votre équipe apprend à déployer l'IA en marketing, ventes et processus internes.",
 "Más de 500.000 seguidores en YouTube": "Plus de 500 000 abonnés sur YouTube",
 "Experiencia formando a profesionales y empresas": "Expérience dans la formation de professionnels et d'entreprises",
 "Enfoque práctico centrado en resultados": "Approche pratique centrée sur les résultats",
 "Programa de IA para empresas en directo": "Programme IA pour entreprises en direct",
 "Formación en IA para empresas fundae": "Formation en IA pour entreprises (financement FUNDAE)",
 "Formación en IA": "Formation en IA",
 # ---------- registration ----------
 "Nombre de usuario": "Nom d'utilisateur",
}

changed = []
for p in sorted(ROOT.rglob("*.tsx")):
    raw = p.read_text(encoding="utf-8")
    new = raw
    for es, fr in T.items():
        if es in new:
            new = new.replace(es, fr)
    if new != raw:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed.append(p.name + " @ " + str(p.parent.relative_to(ROOT)))

print(f"{len(changed)} fichiers modifies")
for c in changed: print("  " + c)
