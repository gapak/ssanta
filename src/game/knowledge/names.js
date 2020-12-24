import _ from "lodash";

export const first_names = {
    slavic: {
        male: ["Oleg", "Igor", "Eugene", "Alexey", "Aleksandr", "Maxim", "Sergey", "Artem", "Anton", "Borys"],
        female: ["Olga", "Anna", "Tanya", "Natasha", "Lada", "Mira", "Julia", "Alyona"]
    },
    american: {
        male: ["Jack", "Mike", "John", "Loris", "Freddy", "Devin", "Peter", "Ethan", "Michael"],
        female: ["Eve", "Jenny", "Jane", "Sophia", "Emma", "Emily", "Grace", "Alice", "Audrey", "Mia"]
    },
    english: {
        male: ["Elliott", "Kristofer", "Andrew", "Gregorio", "Nicol", "George", "William", "Jacob", "Alan", "Antony"],
        female: ["Olivia", "Madison", "Amelia", "Maya", "Aurora", "Emily", "Poppy", "Sophie"]
    }
};

export const last_names = {
    slavic: {
        male: ["Kornak", "Gapak", "Martynson", "Merkulov", "Kozyrev", "Lojchenko", "Ulyanov", "Cherepushak"],
        female: ["Kornak", "Gapak", "Martynson", "Merkulova", "Kozyreva", "Lojchenko", "Ulyanova", "Cherepushak"]
    },
    american: [
        "Foster",
        "Sanders",
        "Ross",
        "Morales",
        "Powell",
        "Sullivan",
        "Johnson",
        "Smith",
        "Brown",
        "Jones",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Taylor",
        "Hernandez",
        "White",
        "Lopez",
        "Gonzalez",
        "Lewis",
        "Torres",
        "Ramirez",
        "Walker",
        "Perez",
        "Hall",
        "Young",
        "Allen",
        "Wright",
        "King",
        "Scott",
        "Green",
        "Baker",
        "Adams",
        "Parker",
        "Collins",
        "Cook",
        "Rogers",
        "Gomez",
        "Kelly",
        "Gutierrez",
        "Perry",
        "Butler",
        "Barnes",
        "Fisher",
        "Henderson",
        "Coleman",
        "Simmons",
        "Patterson",
        "Jordan",
        "Reynolds",
        "Hamilton",
        "Graham",
        "Kim",
        "Gonzales",
        "Ramos",
        "Howard",
        "Ward",
        "Cox",
        "Kennedy",
        "Wells",
        "Alvarez",
        "Woods",
        "Mendoza",
        "Castillo",
        "Olson",
        "Webb",
        "Washington",
        "Tucker",
        "Freeman",
        "Burns",
        "Henry",
        "Vasquez",
        "Snyder",
        "Simpson",
        "Crawford",
        "Jimenez",
        "Porter",
        "Mason",
        "Shaw",
        "Gordon",
        "Wagner",
        "Fernandez",
        "Weaver",
        "Daniels",
        "Stephens",
        "Gardner",
        "Payne",
        "Kelley",
        "Dunn",
        "Pierce",
        "Arnold",
        "Tran",
        "Spencer",
        "Peters",
        "Hawkins",
        "Grant",
        "Hansen",
        "Castro",
        "Hoffman",
        "Hart",
        "Anderson",
        "Cunningham",
        "Knight",
        "Bradley",
        "Hunter",
        "Romero",
        "Hicks",
        "Diaz"
    ],
    english: [
        "Williams",
        "Garcia",
        "Wilson",
        "Anderson",
        "Wallace",
        "Griffin",
        "West",
        "Cole",
        "Hayes",
        "Chavez",
        "Gibson",
        "Bryant",
        "Ellis",
        "Stevens",
        "Murray",
        "Ford",
        "Marshall",
        "Owens",
        "Mcdonald",
        "Dixon",
        "Hunt",
        "Palmer",
        "Robertson",
        "Black",
        "Holmes",
        "Stone",
        "Meyer",
        "Boyd",
        "Mills",
        "Warren",
        "Fox",
        "Rose",
        "Rice",
        "Moreno",
        "Schmidt",
        "Patel",
        "Ferguson",
        "Nichols",
        "Herrera",
        "Medina",
        "Ryan",
        "Harrison",
        "Ruiz",
        "Thomas",
        "Moore",
        "Martin",
        "Jackson",
        "Thompson",
        "Lee",
        "Harris",
        "Clark",
        "Robinson",
        "Nelson",
        "Hill",
        "Campbell",
        "Mitchell",
        "Roberts",
        "Carter",
        "Phillips",
        "Evans",
        "Turner",
        "Edwards",
        "Stewart",
        "Flores",
        "Morris",
        "Murphy",
        "Rivera",
        "Morgan",
        "Peterson",
        "Cooper",
        "Reed",
        "Bailey",
        "Bell",
        "Richardson",
        "Wood",
        "Russell",
        "Ortiz",
        "Jenkins",
        "Watson",
        "Brooks",
        "Bennett",
        "Gray",
        "James",
        "Reyes",
        "Cruz",
        "Hughes",
        "Price",
        "Myers",
        "Long",
        "Foster"
    ]
};

export const genName = gender => {
    let ethnicity = _.sample(["slavic", "english", "american"]);
    let first_name;
    let last_name;
    if (gender === "male") {
        first_name = _.sample(first_names[ethnicity].male);
    }

    if (gender === "female") {
        first_name = _.sample(first_names[ethnicity].female);
    }

    if (gender === "other") {
        first_name = _.sample(_.concat(first_names[ethnicity].male, first_names[ethnicity].female));
    }

    if (ethnicity === "slavic") {
        if (gender === "male") {
            last_name = _.sample(last_names[ethnicity].male);
        }

        if (gender === "female") {
            last_name = _.sample(last_names[ethnicity].female);
        }

        if (gender === "other") {
            last_name = _.sample(_.concat(last_names[ethnicity].male, last_names[ethnicity].female));
        }
    } else last_name = _.sample(last_names[ethnicity]);

    return first_name + " " + last_name;
};
