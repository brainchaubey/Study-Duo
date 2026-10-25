import { Subject } from '../types';

export const CBSE_CLASS_10_SUBJECTS: Subject[] = [
  {
    id: 'maths',
    name: 'Mathematics Standard',
    code: '041',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-600',
    description: 'Number systems, Algebra, Coordinate Geometry, Geometry, Trigonometry, Mensuration, Statistics & Probability.',
    chapters: [
      {
        id: 'math-ch1',
        title: 'Ch 1: Real Numbers',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'm1-q1',
            question: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:',
            options: ['xy', 'xy²', 'x³y³', 'x²y²'],
            correctIndex: 1,
            explanation: 'HCF is the product of the smallest powers of each common prime factor involved: x¹ × y² = xy².'
          },
          {
            id: 'm1-q2',
            question: 'The Fundamental Theorem of Arithmetic states that every composite number can be expressed as a product of:',
            options: ['Odd numbers only', 'Prime numbers uniquely apart from order', 'Even numbers uniquely', 'Rational numbers'],
            correctIndex: 1,
            explanation: 'Every composite number can be uniquely factorized as a product of primes, except for the order in which the prime factors occur.'
          }
        ]
      },
      {
        id: 'math-ch2',
        title: 'Ch 2: Polynomials',
        subtopicCount: 4,
        mcqs: [
          {
            id: 'm2-q1',
            question: 'If α and β are the zeroes of the quadratic polynomial ax² + bx + c (a ≠ 0), then α + β is equal to:',
            options: ['c / a', '-b / a', 'b / a', '-c / a'],
            correctIndex: 1,
            explanation: 'By Vieta’s formulas, the sum of zeroes α + β = -b / a.'
          },
          {
            id: 'm2-q2',
            question: 'The number of zeroes that a polynomial of degree n can have at most is:',
            options: ['n - 1', 'n + 1', 'n', '2n'],
            correctIndex: 2,
            explanation: 'A polynomial of degree n has at most n real zeroes.'
          }
        ]
      },
      {
        id: 'math-ch3',
        title: 'Ch 3: Pair of Linear Equations in Two Variables',
        subtopicCount: 4,
        mcqs: [
          {
            id: 'm3-q1',
            question: 'For what condition does the pair a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 represent coincident lines?',
            options: [
              'a₁/a₂ ≠ b₁/b₂',
              'a₁/a₂ = b₁/b₂ ≠ c₁/c₂',
              'a₁/a₂ = b₁/b₂ = c₁/c₂',
              'a₁/a₂ = c₁/c₂ ≠ b₁/b₂'
            ],
            correctIndex: 2,
            explanation: 'Coincident lines have infinitely many solutions, requiring a₁/a₂ = b₁/b₂ = c₁/c₂.'
          }
        ]
      },
      {
        id: 'math-ch4',
        title: 'Ch 4: Quadratic Equations',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'm4-q1',
            question: 'If the discriminant D = b² - 4ac of ax² + bx + c = 0 is greater than 0, the roots are:',
            options: ['Real and equal', 'Real and distinct', 'No real roots', 'Imaginary only'],
            correctIndex: 1,
            explanation: 'When D > 0, the quadratic equation possesses two distinct real roots.'
          }
        ]
      },
      {
        id: 'math-ch5',
        title: 'Ch 5: Arithmetic Progressions',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'm5-q1',
            question: 'The nth term an of an AP with first term a and common difference d is given by:',
            options: ['a + nd', 'a + (n - 1)d', 'a - (n - 1)d', 'n(a + d)'],
            correctIndex: 1,
            explanation: 'The formula for the nth term of an AP is an = a + (n - 1)d.'
          }
        ]
      },
      {
        id: 'math-ch6',
        title: 'Ch 6: Triangles',
        subtopicCount: 4,
        mcqs: [
          {
            id: 'm6-q1',
            question: 'Basic Proportionality Theorem (Thales Theorem) states that if a line is drawn parallel to one side of a triangle intersecting the other two sides, then:',
            options: [
              'The sides are perpendicular',
              'The other two sides are divided in the same ratio',
              'The area is halved',
              'The perimeter is doubled'
            ],
            correctIndex: 1,
            explanation: 'Thales theorem proves that a line parallel to one side divides the remaining two sides proportionally.'
          }
        ]
      },
      {
        id: 'math-ch7',
        title: 'Ch 7: Coordinate Geometry',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'm7-q1',
            question: 'The distance between points P(x₁, y₁) and Q(x₂, y₂) is:',
            options: [
              '√((x₂ - x₁)² + (y₂ - y₁)²) ',
              '√((x₂ + x₁)² + (y₂ + y₁)²) ',
              '(x₂ - x₁)² + (y₂ - y₁)²',
              '√((x₂ - x₁) + (y₂ - y₁))'
            ],
            correctIndex: 0,
            explanation: 'The standard Euclidean distance formula is √((x₂ - x₁)² + (y₂ - y₁)²).'
          }
        ]
      },
      {
        id: 'math-ch8',
        title: 'Ch 8: Introduction to Trigonometry',
        subtopicCount: 4,
        mcqs: [
          {
            id: 'm8-q1',
            question: 'Which of the following identities is true for any acute angle θ?',
            options: [
              'sin²θ - cos²θ = 1',
              'sin²θ + cos²θ = 1',
              '1 + tan²θ = cot²θ',
              'sec²θ + tan²θ = 1'
            ],
            correctIndex: 1,
            explanation: 'The fundamental Pythagorean trigonometric identity is sin²θ + cos²θ = 1.'
          }
        ]
      },
      {
        id: 'math-ch9',
        title: 'Ch 9: Some Applications of Trigonometry',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'm9-q1',
            question: 'If a pole 6 m high casts a shadow 2√3 m long on the ground, then the sun’s elevation angle is:',
            options: ['30°', '45°', '60°', '90°'],
            correctIndex: 2,
            explanation: 'tan θ = Height / Shadow = 6 / (2√3) = 3 / √3 = √3. Hence θ = 60°.'
          }
        ]
      },
      {
        id: 'math-ch10',
        title: 'Ch 10: Circles',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'm10-q1',
            question: 'The tangent at any point of a circle is perpendicular to the:',
            options: ['Chord', 'Diameter at all points', 'Radius through the point of contact', 'Secant'],
            correctIndex: 2,
            explanation: 'Theorem 10.1: The tangent at any point of a circle is perpendicular to the radius through the point of contact.'
          }
        ]
      },
      {
        id: 'math-ch11',
        title: 'Ch 11: Areas Related to Circles',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'm11-q1',
            question: 'The area of a sector of angle θ (in degrees) of a circle with radius r is:',
            options: ['(θ / 360) × 2πr', '(θ / 360) × πr²', '(θ / 180) × πr²', '(θ / 360) × πr³'],
            correctIndex: 1,
            explanation: 'Area of sector = (θ / 360°) × πr².'
          }
        ]
      },
      {
        id: 'math-ch12',
        title: 'Ch 12: Surface Areas and Volumes',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'm12-q1',
            question: 'Total surface area of a solid hemisphere of radius r is:',
            options: ['2πr²', '3πr²', '4πr²', '(2/3)πr³'],
            correctIndex: 1,
            explanation: 'Curved surface area (2πr²) + base circular area (πr²) = 3πr².'
          }
        ]
      },
      {
        id: 'math-ch13',
        title: 'Ch 13: Statistics',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'm13-q1',
            question: 'The empirical relationship between the three measures of central tendency is:',
            options: [
              '3 Median = Mode + 2 Mean',
              'Mode = 3 Mean - 2 Median',
              'Mean = 3 Median - 2 Mode',
              'Median = 3 Mode - 2 Mean'
            ],
            correctIndex: 0,
            explanation: 'Empirical formula: Mode = 3 Median - 2 Mean, which rearranges to 3 Median = Mode + 2 Mean.'
          }
        ]
      },
      {
        id: 'math-ch14',
        title: 'Ch 14: Probability',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'm14-q1',
            question: 'The probability of an event E satisfies which of the following inequalities?',
            options: ['0 < P(E) < 1', '0 ≤ P(E) ≤ 1', '-1 ≤ P(E) ≤ 1', 'P(E) > 1'],
            correctIndex: 1,
            explanation: 'The probability of any event always lies between 0 (impossible event) and 1 (certain event) inclusive.'
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    code: '086',
    iconName: 'Atom',
    color: 'from-emerald-600 to-teal-600',
    description: 'Chemical Substances, World of Living, Natural Phenomena, Effects of Current, Natural Resources.',
    chapters: [
      {
        id: 'sci-ch1',
        title: 'Ch 1: Chemical Reactions and Equations',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's1-q1',
            question: 'When aqueous solutions of lead nitrate and potassium iodide are mixed, the precipitate formed is:',
            options: ['White lead sulfate', 'Yellow lead iodide', 'Brown lead oxide', 'Red lead nitrate'],
            correctIndex: 1,
            explanation: 'Pb(NO₃)₂ + 2KI → PbI₂ (yellow precipitate) + 2KNO₃.'
          }
        ]
      },
      {
        id: 'sci-ch2',
        title: 'Ch 2: Acids, Bases and Salts',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's2-q1',
            question: 'Tooth decay starts when the pH of the mouth becomes lower than:',
            options: ['7.0', '6.5', '5.5', '4.0'],
            correctIndex: 2,
            explanation: 'Enamel (calcium hydroxyapatite) begins corroding when oral pH drops below 5.5 due to acid-producing bacteria.'
          }
        ]
      },
      {
        id: 'sci-ch3',
        title: 'Ch 3: Metals and Non-metals',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's3-q1',
            question: 'Which of the following metals is liquid at room temperature?',
            options: ['Sodium', 'Mercury', 'Lead', 'Bromine'],
            correctIndex: 1,
            explanation: 'Mercury (Hg) is a metal that remains liquid at room temperature; Bromine is a liquid non-metal.'
          }
        ]
      },
      {
        id: 'sci-ch4',
        title: 'Ch 4: Carbon and its Compounds',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's4-q1',
            question: 'The self-linking property of carbon atoms to form long chains or rings is called:',
            options: ['Tetravalency', 'Isomerism', 'Catenation', 'Esterification'],
            correctIndex: 2,
            explanation: 'Catenation is the unique ability of carbon to form bonds with other atoms of carbon, giving rise to large molecules.'
          }
        ]
      },
      {
        id: 'sci-ch5',
        title: 'Ch 5: Life Processes',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's5-q1',
            question: 'During photosynthesis, oxygen released into the atmosphere originates from:',
            options: ['Carbon dioxide', 'Water', 'Chlorophyll', 'Glucose'],
            correctIndex: 1,
            explanation: 'Photolysis of water molecules (H₂O) during light-dependent reactions splits water into hydrogen ions and oxygen gas.'
          }
        ]
      },
      {
        id: 'sci-ch6',
        title: 'Ch 6: Control and Coordination',
        subtopicCount: 3,
        mcqs: [
          {
            id: 's6-q1',
            question: 'Which plant hormone promotes cell division and is present in high concentration in fruits and seeds?',
            options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Abscisic acid'],
            correctIndex: 2,
            explanation: 'Cytokinins promote cell division and are found in greater abundance in areas of rapid cell division like fruits and seeds.'
          }
        ]
      },
      {
        id: 'sci-ch7',
        title: 'Ch 7: How do Organisms Reproduce?',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's7-q1',
            question: 'Amoeba reproduces asexually primarily through the process of:',
            options: ['Budding', 'Multiple fission', 'Binary fission', 'Spore formation'],
            correctIndex: 2,
            explanation: 'Under favorable conditions, Amoeba divides into two daughter cells by binary fission.'
          }
        ]
      },
      {
        id: 'sci-ch8',
        title: 'Ch 8: Heredity and Evolution',
        subtopicCount: 3,
        mcqs: [
          {
            id: 's8-q1',
            question: 'A cross between a tall pea plant (TT) and a short pea plant (tt) resulted in progeny that were all tall because:',
            options: ['Tallness is the dominant trait', 'Shortness is dominant', 'Both are co-dominant', 'Recessive traits mutate'],
            correctIndex: 0,
            explanation: 'In Mendel’s monohybrid cross, tallness (T) is dominant over shortness (t), so all F1 (Tt) plants are phenotypically tall.'
          }
        ]
      },
      {
        id: 'sci-ch9',
        title: 'Ch 9: Light – Reflection and Refraction',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's9-q1',
            question: 'A convex lens has a focal length of 20 cm. What is its optical power in dioptres?',
            options: ['+2 D', '+5 D', '-5 D', '+0.05 D'],
            correctIndex: 1,
            explanation: 'Power P = 1 / f (in metres) = 1 / 0.20 m = +5 D.'
          }
        ]
      },
      {
        id: 'sci-ch10',
        title: 'Ch 10: The Human Eye and the Colorful World',
        subtopicCount: 3,
        mcqs: [
          {
            id: 's10-q1',
            question: 'The splitting of white light into its component colors upon passing through a glass prism is called:',
            options: ['Reflection', 'Total internal reflection', 'Dispersion', 'Atmospheric refraction'],
            correctIndex: 2,
            explanation: 'Dispersion is the phenomenon of splitting white light into its seven constituent colors due to different wavelengths refracting at different angles.'
          }
        ]
      },
      {
        id: 'sci-ch11',
        title: 'Ch 11: Electricity',
        subtopicCount: 4,
        mcqs: [
          {
            id: 's11-q1',
            question: 'According to Ohm’s law, at constant temperature, the current flowing through a conductor is:',
            options: [
              'Inversely proportional to potential difference',
              'Directly proportional to potential difference across its ends',
              'Directly proportional to square of resistance',
              'Independent of voltage'
            ],
            correctIndex: 1,
            explanation: 'Ohm’s law states V ∝ I (or V = IR), meaning current is directly proportional to potential difference.'
          }
        ]
      },
      {
        id: 'sci-ch12',
        title: 'Ch 12: Magnetic Effects of Electric Current',
        subtopicCount: 3,
        mcqs: [
          {
            id: 's12-q1',
            question: 'The direction of magnetic field lines inside a current-carrying solenoid is from:',
            options: ['North pole to South pole', 'South pole to North pole', 'East to West', 'Circular only'],
            correctIndex: 1,
            explanation: 'Inside a solenoid, the magnetic field is uniform and directed from South pole to North pole (forming closed continuous loops).'
          }
        ]
      },
      {
        id: 'sci-ch13',
        title: 'Ch 13: Our Environment',
        subtopicCount: 2,
        mcqs: [
          {
            id: 's13-q1',
            question: 'According to Lindeman’s 10% law, the amount of energy transferred from one trophic level to the next is approximately:',
            options: ['1%', '5%', '10%', '50%'],
            correctIndex: 2,
            explanation: 'Only about 10% of the energy is stored as biomass and made available to the next trophic level in a food chain.'
          }
        ]
      }
    ]
  },
  {
    id: 'sst',
    name: 'Social Science',
    code: '087',
    iconName: 'Globe',
    color: 'from-amber-600 to-orange-600',
    description: 'History (India & World), Contemporary Geography, Democratic Politics & Economic Development.',
    chapters: [
      {
        id: 'sst-ch1',
        title: 'History Ch 1: The Rise of Nationalism in Europe',
        subtopicCount: 4,
        mcqs: [
          {
            id: 'sst1-q1',
            question: 'Who hosted the Congress of Vienna in 1815?',
            options: ['Otto von Bismarck', 'Duke Metternich', 'Giuseppe Mazzini', 'Napoleon Bonaparte'],
            correctIndex: 1,
            explanation: 'Austrian Chancellor Duke Metternich hosted the Congress of Vienna to re-establish conservative order in Europe.'
          }
        ]
      },
      {
        id: 'sst-ch2',
        title: 'History Ch 2: Nationalism in India',
        subtopicCount: 4,
        mcqs: [
          {
            id: 'sst2-q1',
            question: 'The infamous Jallianwala Bagh massacre occurred on 13th April 1919 in Amritsar under the command of:',
            options: ['Lord Curzon', 'General Dyer', 'Lord Irwin', 'Sir John Simon'],
            correctIndex: 1,
            explanation: 'General Dyer blocked the exit points and ordered troops to open fire on the peaceful gathering at Jallianwala Bagh.'
          }
        ]
      },
      {
        id: 'sst-ch3',
        title: 'History Ch 3: The Making of a Global World',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'sst3-q1',
            question: 'The devastating cattle disease that spread across Africa in the 1890s destroying livelihoods was known as:',
            options: ['Rinderpest', 'Anthrax', 'Foot and Mouth Disease', 'Bovine plague'],
            correctIndex: 0,
            explanation: 'Rinderpest (cattle plague) arrived in Africa in the late 1880s and wiped out 90% of the cattle, destroying traditional livelihoods.'
          }
        ]
      },
      {
        id: 'sst-ch4',
        title: 'Geography Ch 1: Resources and Development',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'sst4-q1',
            question: 'Black soil, also known as Regur soil, is ideal for the cultivation of:',
            options: ['Tea', 'Cotton', 'Coffee', 'Jute'],
            correctIndex: 1,
            explanation: 'Black soil has high moisture retention and clayey texture, making it best suited for cotton cultivation.'
          }
        ]
      },
      {
        id: 'sst-ch5',
        title: 'Pol Sci Ch 1: Power Sharing',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'sst5-q1',
            question: 'In Belgium, power is constitutionally shared equally between which two major linguistic communities?',
            options: ['German and French', 'Dutch and French', 'Dutch and German', 'English and French'],
            correctIndex: 1,
            explanation: 'The Belgian model dictates that the number of Dutch and French-speaking ministers shall be equal in the central government.'
          }
        ]
      },
      {
        id: 'sst-ch6',
        title: 'Pol Sci Ch 2: Federalism',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'sst6-q1',
            question: 'In India, subjects of national importance like Defense, Foreign Affairs, and Currency are placed in the:',
            options: ['State List', 'Union List', 'Concurrent List', 'Residuary List'],
            correctIndex: 1,
            explanation: 'The Union List contains matters of national importance where only the Central Parliament can legislate.'
          }
        ]
      },
      {
        id: 'sst-ch7',
        title: 'Economics Ch 1: Development',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'sst7-q1',
            question: 'The Human Development Index (HDI) published by UNDP compares countries based on:',
            options: [
              'Income alone',
              'Educational levels, health status, and per capita income',
              'Military power and territory size',
              'Industrial output and export volume'
            ],
            correctIndex: 1,
            explanation: 'HDI evaluates life expectancy at birth (health), schooling years (education), and GNI per capita (income).'
          }
        ]
      },
      {
        id: 'sst-ch8',
        title: 'Economics Ch 3: Money and Credit',
        subtopicCount: 3,
        mcqs: [
          {
            id: 'sst8-q1',
            question: 'In India, which institution issues currency notes on behalf of the Central Government?',
            options: ['State Bank of India', 'Reserve Bank of India (RBI)', 'Ministry of Finance', 'NITI Aayog'],
            correctIndex: 1,
            explanation: 'The Reserve Bank of India (RBI) is the supreme monetary authority legally authorized to issue currency notes.'
          }
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English Language & Literature',
    code: '184',
    iconName: 'BookOpen',
    color: 'from-violet-600 to-purple-600',
    description: 'First Flight (Prose & Poems), Footprints without Feet (Supplementary), Reading & Writing Skills.',
    chapters: [
      {
        id: 'eng-ch1',
        title: 'First Flight: A Letter to God',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'eng1-q1',
            question: 'What destroyed Lencho’s corn field in Gregorio López y Fuentes’s story?',
            options: ['Locust swarm', 'Severe drought', 'A destructive hailstorm', 'Flash floods'],
            correctIndex: 2,
            explanation: 'Large hailstones fell for an hour until the whole field was covered white like salt, destroying every single crop.'
          }
        ]
      },
      {
        id: 'eng-ch2',
        title: 'First Flight: Nelson Mandela – Long Walk to Freedom',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'eng2-q1',
            question: 'According to Nelson Mandela, what is courage?',
            options: [
              'Absence of fear',
              'Triumph over fear',
              'Physical strength',
              'Inability to feel pain'
            ],
            correctIndex: 1,
            explanation: 'Mandela wrote that the brave man is not he who does not feel afraid, but he who conquers that fear.'
          }
        ]
      },
      {
        id: 'eng-ch3',
        title: 'First Flight (Poem): Dust of Snow & Fire and Ice',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'eng3-q1',
            question: 'In Robert Frost’s "Fire and Ice", the word "fire" symbolizes human:',
            options: ['Desire and greed', 'Hatred and indifference', 'Enlightenment', 'Warmth and compassion'],
            correctIndex: 0,
            explanation: 'Frost equates fire with passionate desire, lust, and greed that can consume the world.'
          }
        ]
      },
      {
        id: 'eng-ch4',
        title: 'Footprints without Feet: A Triumph of Surgery',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'eng4-q1',
            question: 'What was Tricki the dog suffering from in James Herriot’s story?',
            options: ['Rabies', 'Overfeeding and lack of physical exercise', 'Malnutrition', 'Bone fracture'],
            correctIndex: 1,
            explanation: 'Mrs. Pumphrey spoiled Tricki with rich food and sweets without exercise, causing severe obesity and lethargy.'
          }
        ]
      },
      {
        id: 'eng-ch5',
        title: 'Footprints without Feet: The Thief’s Story',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'eng5-q1',
            question: 'Why did Hari Singh decide to return the stolen money to Anil?',
            options: [
              'Fear of the police',
              'Anil’s kindness and the desire to learn how to read and write',
              'The train to Lucknow had already departed',
              'The notes were wet and useless'
            ],
            correctIndex: 1,
            explanation: 'Hari realized that education and self-respect with Anil were far more valuable than a few hundred rupees.'
          }
        ]
      }
    ]
  },
  {
    id: 'hindi',
    name: 'Hindi Course A (हिंदी अ)',
    code: '002',
    iconName: 'Languages',
    color: 'from-rose-600 to-pink-600',
    description: 'क्षितिज भाग-2 (काव्य व गद्य खंड), कृतिका भाग-2, व्याकरण एवं रचनात्मक लेखन।',
    chapters: [
      {
        id: 'hin-ch1',
        title: 'क्षितिज: पद (सूरदास)',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'hin1-q1',
            question: 'गोपियों ने उद्धव को बड़भागी (भाग्यशाली) कहकर वास्तव में क्या किया है?',
            options: ['सच्ची प्रशंसा की है', 'व्यंग्य (कटाक्ष) किया है', 'क्षमा याचना की है', 'उपहास उड़ाने से मना किया है'],
            correctIndex: 1,
            explanation: 'गोपियों ने उद्धव को बड़भागी कहकर वक्रोक्ति (व्यंग्य) किया है कि श्रीकृष्ण के समीप रहकर भी वे प्रेम के बंधन से अछूते रहे।'
          }
        ]
      },
      {
        id: 'hin-ch2',
        title: 'क्षितिज: राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'hin2-q1',
            question: 'शिवजी का धनुष टूटने पर क्रोधित होकर जनक की सभा में कौन उपस्थित हुए?',
            options: ['विश्वामित्र', 'दशरथ', 'परशुराम', 'वसिष्ठ'],
            correctIndex: 2,
            explanation: 'शिव धनुष भंग होने का समाचार सुनकर भगवान परशुराम अत्यंत कुपित होकर राजा जनक की सभा में पहुंचे।'
          }
        ]
      },
      {
        id: 'hin-ch3',
        title: 'क्षितिज: नेताजी का चश्मा (स्वयं प्रकाश)',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'hin3-q1',
            question: 'नेताजी सुभाष चंद्र बोस की संगमरमर की मूर्ति पर चश्मा कौन लगाता था?',
            options: ['हालदार साहब', 'पानवाला', 'कैप्टन चश्मेवाला', 'मास्टर मोतीलाल'],
            correctIndex: 2,
            explanation: 'कैप्टन चश्मेवाला देशभक्ति की भावना से प्रेरित होकर अपनी छोटी सी दुकान से मूर्ति पर चश्मा लगा दिया करता था।'
          }
        ]
      },
      {
        id: 'hin-ch4',
        title: 'क्षितिज: बालगोबिन भगत (रामवृक्ष बेनीपुरी)',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'hin4-q1',
            question: 'बालगोबिन भगत किसे अपना ‘साहब’ मानते थे और उन्हीं के पदों को गाते थे?',
            options: ['कबीरदास को', 'तुलसीदास को', 'सूरदास को', 'रैदास को'],
            correctIndex: 0,
            explanation: 'बालगोबिन भगत कबीर को ‘साहब’ मानते थे, उन्हीं के आदेशों और आदर्शों पर चलते थे।'
          }
        ]
      },
      {
        id: 'hin-ch5',
        title: 'कृतिका: माता का आँचल (शिवपूजन सहाय)',
        subtopicCount: 2,
        mcqs: [
          {
            id: 'hin5-q1',
            question: 'साँप निकलने पर भयभीत होकर भोलानाथ किसके आँचल में छिप गए?',
            options: ['पिताजी की गोद में', 'माता के आँचल में', 'मित्रों के पीछे', 'गोशाला में'],
            correctIndex: 1,
            explanation: 'डर के मारे कांपते हुए भोलानाथ सीधे माँ की गोद और आँचल में जाकर दुबक गए, जहाँ उन्हें सच्चा सुरक्षा-भाव मिला।'
          }
        ]
      }
    ]
  }
];
