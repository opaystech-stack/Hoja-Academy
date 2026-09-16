# -*- coding: utf-8 -*-
"""Nettoyage identite heritee: personnes, bios, liens, legal espagnol, FUNDAE, Isabel/ECTS.
Remplacements en place uniquement (aucune modification de structure DOM)."""
import re, pathlib

ROOT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")

def apply_file(p, pairs):
    t = p.read_text(encoding="utf-8")
    orig = t
    for a, b in pairs:
        if callable(a):
            t = a(t)
        else:
            if a not in t:
                print("   [ABSENT]", p.name, "->", a[:60])
            t = t.replace(a, b)
    if t != orig:
        p.write_text(t, encoding="utf-8", newline="\n")
        return True
    return False

# --------- bios personnes -> texte generique (pas de faux noms/chiffres)
BIO_A = "Notre \u00e9quipe p\u00e9dagogique r\u00e9unit des praticiens de terrain : chaque formateur utilise quotidiennement l'IA, l'automatisation et les agents sur des projets professionnels r\u00e9els, et transpose cette exp\u00e9rience dans ses s\u00e9ances."
BIO_B = "Approche 100 % appliqu\u00e9e : d\u00e8s la premi\u00e8re s\u00e9ance, vous travaillez sur vos propres cas r\u00e9els, avec des outils professionnels \u00e0 jour et un suivi individualis\u00e9."

def bio_regex(t):
    # lignes bio Alejavi/Jose (variantes multi-fichiers) -> generique
    t = re.sub(r"Alejavi Rivera est une r\u00e9f\u00e9rence[\s\S]{0,600}?domaine\.", BIO_A, t)
    t = re.sub(r"Depuis 2019, avant l'essor[\s\S]{0,700}?sectores\.[^<\n]*", BIO_B, t)
    t = re.sub(r"Depuis 2019, avant l'essor[\s\S]{0,700}?domaine\.", "", t)
    t = re.sub(r"Jose Moral est passionn\u00e9[\s\S]{0,500}?clients\.", BIO_A, t)
    t = re.sub(r"Il a travaill\u00e9 sur des projets d'automatisation avec des entreprises comme[\s\S]{0,400}?r\u00e9els\.", BIO_B, t)
    t = t.replace("Tuteur, formateur et fondateur", "Formateurs experts")
    t = t.replace("Responsable des automatisations IA", "Formateur \u2014 automatisation & agents")
    t = t.replace("JOSE MORAL", "FORMATEUR")
    t = t.replace("ALEJAVI RIVERA", "\u00c9QUIPE P\u00c9DAGOGIQUE")
    t = t.replace("En compl\u00e9ment de l'accompagnement continu d'Alejavi Rivera et de l'\u00e9quipe pendant tout le cours",
                  "En compl\u00e9ment de l'accompagnement continu de l'\u00e9quipe p\u00e9dagogique pendant tout le cours")
    t = t.replace("Alejavi Rivera pilote la formation principale du programme, entour\u00e9 de sp\u00e9cialistes en automatisation et en application concr\u00e8te de l'IA en entreprise.",
                  "La formation principale est pilot\u00e9e par notre \u00e9quipe p\u00e9dagogique, entour\u00e9e de sp\u00e9cialistes en automatisation et en application concr\u00e8te de l'IA en entreprise.")
    t = re.sub(r'\{"Il sera le formateur en charge (?:de cette formation|du module automatisation)\. Vous pouvez (?:voir|consulter) le parcours de Jose Moral sur "\}',
               '{"Chaque module est anim\u00e9 par un formateur r\u00e9f\u00e9rent du domaine."}', t)
    t = re.sub(r'\{"en dispensant la majeure partie de la formation et en accompagnant les apprenants tout au long du programme\. Vous pouvez voir le parcours d\'Alejavi Rivera sur "\}',
               '{"en dispensant la majeure partie de la formation et en accompagnant les apprenants tout au long du programme."}', t)
    # liens LinkedIn personnes -> retire la cible (garde l'ancre inoffensive)
    t = t.replace('href="https://www.linkedin.com/in/alejavirivera/"', 'href="#"')
    t = t.replace('href="https://www.linkedin.com/in/josemmoral/"', 'href="#"')
    t = t.replace("\u2013 Alejavi Rivera", "\u2013 \u00c9quipe p\u00e9dagogique HOJA ACADEMY")
    # temoignages nomatifs -> anonymises (phrases conservees, identité retirée)
    t = t.replace("Yago \u2014 Musicien et nutritionniste", "Apprenant \u2014 promotion HOJA ACADEMY")
    # iframe video heritee (visage reel) -> placeholder structurel
    t = re.sub(r'<iframe([^>]*?)title="Yahir[^"]*"([^>]*?)/>',
               lambda m: '<span' + m.group(1) + 'title="Vid\u00e9o pr\u00e9sentation HOJA ACADEMY"' + m.group(2) + 'role="img" aria-label="Vid\u00e9o pr\u00e9sentation \u00e0 venir"></span>', t)
    # URLs videos heritees
    t = re.sub(r'href="https://youtu\.be/[^"]*"', 'href="#"', t)
    t = re.sub(r'href="https://www\.youtube\.com/watch[^"]*"', 'href="#"', t)
    return t

LEGAL_ES = [
 # ---- FUNDAE / financement Espagne
 ("Formation en IA pour entreprises \u00e9ligible au financement FUNDAE", "Formation en IA pour entreprises, sur site ou \u00e0 distance"),
 ("FINANCEMENT FUNDAE", "PLAN DE FORMATION SUR MESURE"),
 ("Financement FUNDAE", "Plan de formation sur mesure"),
 (", vous pouvez donc former votre \u00e9quipe \u00e0 l'IA appliqu\u00e9e", ", vous pouvez former votre \u00e9quipe \u00e0 l'IA appliqu\u00e9e"),
 ("\u00c9ligible au financement FUNDAE", "Facturation entreprise \u00e9tablie"),
 ("Le Programme Intensif est finan\u00e7able par les entreprises via FUNDAE. Nous proposons \u00e9galement des plans de financement en paiements \u00e9chelonn\u00e9s.",
  "Le Programme Intensif est factur\u00e9 aux entreprises et propose des plans de financement en paiements \u00e9chelonn\u00e9s."),
 ("Afin de garantir le bon d\u00e9roulement des cours, la d\u00e9livrance de certificats officiels et le respect des exigences d'entit\u00e9s externes (par exemple FUNDAE ou universit\u00e9s partenaires), HOJA ACADEMY",
  "Afin de garantir le bon d\u00e9roulement des cours et la d\u00e9livrance des certifications, HOJA ACADEMY"),
 # ---- Universidad Isabel I / ECTS
 (" Vous pourrez aussi obtenir une double certification d\u00e9livr\u00e9e par HOJA ACADEMY et l'Universidad Isabel I.",
  " Vous recevrez la certification officielle HOJA ACADEMY, compl\u00e9t\u00e9e par le projet final \u00ab My AI Work System \u00bb."),
 ("\u00e9double certification avalada par HOJA ACADEMY y por la Universidad Isabel I", "certification officielle HOJA ACADEMY"),
 ('{" la possibilit\u00e9 d\'obtenir un certificat universitaire en Intelligence Artificielle de l\'Universidad Isabel I valant \u00e9galement 2 cr\u00e9dits ECTS.* "}',
  '{" et un programme de specialization en robotique & IA pour la recherche (m\u00e9decine, science, math\u00e9matiques). "}'),
 ("d'obtenir un certificat universitaire en Intelligence Artificielle de l'Universidad Isabel I",
  "d'acc\u00e9der \u00e0 notre specialization robotique & IA pour la recherche"),
 ("valant \u00e9galement 2 cr\u00e9dits ECTS.*", "*"),
 ("que compte en plus 2 cr\u00e9dits ECTS.", "."),
 # ---- AI VENTURE -> HOJA ACADEMY
 ("AI VENTURE S.L., avec NIF B19870641 A et domicile fiscal \u00e0 C/ Caser\u00eda Aguirre, 44, 18013. Granada, titulaire du site web https://hoja-academy.com/ et responsable du traitement de vos donn\u00e9es \u00e0 caract\u00e8re personnel, de leurs usages et de leur protection.",
  "HOJA ACADEMY, \u00e9diteur du site https://hoja-academy.com/, est responsable du traitement de vos donn\u00e9es \u00e0 caract\u00e8re personnel, de leurs usages et de leur protection."),
 ("AI VENTURE S.L.", "HOJA ACADEMY"),
 ("Pour la r\u00e9solution de tout litige, les parties se soumettent express\u00e9ment \u00e0 la juridiction des tribunaux de Grenade, Espagne, renon\u00e7ant \u00e0 tout autre for qui pourrait leur revenir.",
  "Pour la r\u00e9solution de tout litige, les parties s'efforceront de trouver une solution amiable ; \u00e0 d\u00e9faut, les tribunaux comp\u00e9tents seront ceux d\u00e9sign\u00e9s par la l\u00e9gislation applicable."),
 ("conform\u00e9ment \u00e0 la loi espagnole sur la propri\u00e9t\u00e9 intellectuelle (Real Decreto Legislativo 1/1996, du 12 avril) et par toute autre r\u00e9glementation applicable en Espagne et dans l'Union europ\u00e9enne.",
  "conform\u00e9ment \u00e0 la l\u00e9gislation applicable en mati\u00e8re de propri\u00e9t\u00e9 intellectuelle, notamment dans les \u00c9tats membres de l'Union europ\u00e9enne."),
 ("notamment aupr\u00e8s de la Agencia Espa\u00f1ola de Protecci\u00f3n de Datos", "aupr\u00e8s de l'autorit\u00e9 de contr\u00f4le comp\u00e9tente"),
 ("Les communications seront re\u00e7ues et trait\u00e9es par l'Unit\u00e9 Responsable de l'Accessibilit\u00e9 de la Subdirecci\u00f3n General de Promoci\u00f3n y Autorizaciones.",
  "Les communications relatives \u00e0 l'accessibilit\u00e9 sont re\u00e7ues et trait\u00e9es par l'\u00e9quipe HOJA ACADEMY \u00e0 l'adresse info@hoja-academy.com."),
]

def legal_regex(t):
    # avis legal Espagne -> neutre (regex robustes, independants de la ponctuation exacte)
    t = re.sub(r"Conform[ée]ment [àa] l['\u2019]article 10 de la Ley 34/2002[\s\S]{0,160}?fournies\s*:",
               "Les informations suivantes sont fournies conform\u00e9ment \u00e0 la l\u00e9gislation applicable sur le commerce \u00e9lectronique :", t)
    t = re.sub(r"N\.?I\.?F\.? ?B19870641", "—", t)
    t = re.sub(r"C/ Caser[íi]a Aguirre[,.][^\"<\n]*?Granada", "Contact : info@hoja-academy.com", t)
    t = re.sub(r"gestionnaire de la marque[\s\S]{0,60}?s['\u2019]est engag[ée]e [àa] rendre son site web accessible[\s\S]{0,220}?(?:Europe|europ[ée]enne)\.?",
               "HOJA ACADEMY s'engage \u00e0 rendre son site web accessible, conform\u00e9ment aux normes d'accessibilit\u00e9 num\u00e9rique en vigueur (WCAG 2.1) et aux r\u00e8glementations applicables.", t)
    t = re.sub(r"R[èe]glement \(UE\) 2016/679 \(RGPD\)", "RGPD", t)
    t = re.sub(r"article 10\.2\.a du \)?RD 1112/2018", "l\u00e9gislation applicable", t)
    t = re.sub(r"\(?article 12\.5 du \)?RD 1112/2018", "la r\u00e9glementation applicable", t)
    t = re.sub(r"\(?article 13 du \)?RD 1112/2018", "la r\u00e9glementation applicable", t)
    t = re.sub(r"exigences (?:du|de l['\u2019article[^<\n]*?) RD 1112/2018", "exigences d'accessibilit\u00e9 applicables", t)
    t = re.sub(r"RD 1112/2018(?:, du 7 s\w+)?", "la r\u00e9glementation applicable en mati\u00e8re d'accessibilit\u00e9", t)
    t = re.sub(r"Real Decreto 1112/2018[^<\n]*", "la r\u00e9glementation applicable en mati\u00e8re d'accessibilit\u00e9", t)
    t = re.sub(r"article 3, paragraphe 4", "la r\u00e9glementation applicable", t)
    t = re.sub(r"href=\"https://sedeagpd\.gob\.es[^\"]*\"", 'href="mailto:info@hoja-academy.com"', t)
    t = re.sub(r"Subdirecci[oó]n General de Promoci[oó]n y Autorizaciones[.,]?", "l'\u00e9quipe HOJA ACADEMY", t)
    t = re.sub(r"Agence (?:Espanole|Espagnole|espagnole) de Protection", "autorit\u00e9 comp\u00e9tente", t)
    t = re.sub(r"Agencia Espa[nñ]ola de Protecci[oó]n de Datos", "autorit\u00e9 comp\u00e9tente", t)
    t = re.sub(r"tribunaux de Grenade[^<\n]*?revenir\.", "les juridictions comp\u00e9tentes d\u00e9sign\u00e9es par la l\u00e9gislation applicable.", t)
    t = re.sub(r"Conform[ée]ment [àa] la l[ée]gislation espagnole", "Conform\u00e9ment \u00e0 la l\u00e9gislation applicable", t)
    t = re.sub(r"l[ée]gislation espagnole", "l\u00e9gislation applicable", t)
    t = re.sub(r"loi espagnole sur la propri[ée]t[ée] intellectuelle[^<\n]*?europ[ée]enne\.", "la l\u00e9gislation applicable en mati\u00e8re de propri\u00e9t\u00e9 intellectuelle.", t)
    t = re.sub(r"Falta de conformidad[\s\S]{0,40}?:", "Non-conformit\u00e9s :", t)
    return t

changed = []
for p in sorted(ROOT.rglob("*.tsx")) + sorted(ROOT.rglob("*.ts")):
    touched = False
    t = p.read_text(encoding="utf-8"); o = t
    t = bio_regex(t)
    for a, b in LEGAL_ES:
        if a in t: t = t.replace(a, b)
    t = legal_regex(t)
    if t != o:
        p.write_text(t, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))
print("fichiers modifi\u00e9s:", len(changed))
for c in changed: print("   ", c)
