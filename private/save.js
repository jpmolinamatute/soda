const list = [
    'abigail',
    'andre',
    'andrei',
    'ariel',
    'gaby',
    'irina',
    'ismini',
    'jorge',
    'nicol',
    'nicole',
    'valeria',
    'valeria',
    'wendy',
    'xiara',
    'yipy',
    'olguita',
    'salma',
    'steven',

    'abigail benavides',
    'adrian cardozo',
    'alejandra alvarado',
    'alejandra superabuela',
    'alejandro chino',
    'alexander rojas',
    'alfonso ariño',
    'amelia alfaro',
    'anden chino',
    'andrea alfaro',
    'andrea chua',
    'andrea mora',
    'andres gemelo',
    'andres ruiz',
    'andres zuñiga',
    'antonio rojas',
    'camila montero',
    'carlos alpizar',
    'carlos avvau',
    'carlos murillo',
    'cintia china',
    'claudio araya',
    'cristina baltodano',
    'daniel alvarado',
    'daniel azofeifa',
    'daniela angulo',
    'daniela hernandez',
    'daniela jenkins',
    'david castro',
    'david sanabria',
    'david solano',
    'emil saume',
    'emma campos',
    'esteban badilla',
    'fabian muñoz',
    'felipe acon',
    'fiorella sanabria',
    'francisco vargas',
    'fredy zamora',
    'gabriel alvarado',
    'gabriel guerra',
    'gabriela fuentes',
    'gabriela vega',
    'gaby alvarado',
    'guillermo benavides',
    'ignacio molina',
    'isaac ramirez',
    'isabella riera',
    'isaura rodriguez',
    'javier macis',
    'jimena cubero',
    'jimena gemela',
    'jimena rojas',
    'jorge ramirez',
    'jorge villegas',
    'josue chaves',
    'julian guerra',
    'julian solis',
    'juliana calzada',
    'kenny flores',
    'laura acosta',
    'lindsy villegas',
    'lucia rodriguez',
    'lucia villalobos',
    'luisana chacon',
    'marco ramirez',
    'maria ajun',
    'maria salas',
    'mariana ulloa',
    'mariangel vargas',
    'mariangelica soto',
    'mariela jenny',
    'mario vargas',
    'maripaz blanco',
    'maripaz ramirez',
    'maripaz rodriguez',
    'maripaz saenz',
    'matias garcia',
    'matias leandro',
    'mauricio rodriguez',
    'mauricio saborio',
    'milena bolaños',
    'milena rodriguez',
    'monica alvarez',
    'monica chaves',
    'monica cubillos',
    'monserrat martinez',
    'nicol diaz',
    'nicole vasquez',
    'oscar fonseca',
    'oscar saenz',
    'pablo araya',
    'paola zamora',
    'rebeca hernandez',
    'roberto muñoz',
    'rodrigo vanderlat',
    'santiago melendez',
    'santiago quiros',
    'santiago rojas',
    'sara bolaños',
    'sara carballo',
    'sebastian molina',
    'sebastian mora',
    'sebastian zuñiga',
    'silvia arias',
    'silvia mantilla',
    'sofia hernandez',
    'sofia parada',
    'sofia serrano',
    'sofia solano',
    'sofia vega',
    'sonia vargas',
    'suriam miurk',
    'teacher xio',
    'tobias muñoz',
    'valentina arias',
    'valentina castillo',
    'valentina cubero',
    'valeria cartin',
    'valeria castro',
    'valeria hutchinson',
    'veronica arevalo',
    'veronica yamileth',
    'victoria leiva',
    'victoria m',

    'jorge andres quiros',
    'jorge ramirez bonilla',
    'jorge ramirez murillo',
    'jose arias serrano',
    'jose carlos acevedo',
    'jose daniel espinach',
    'jose ignacio saez',
    'jose manuel rojas',
    'jose maria ramirez',
    'jose miguel oviedo',
    'jose pablo araya',
    'jose pablo vargas',
    'juan david gemelo',
    'juan ignacio zuñiga',
    'luis alejandro ramirez',
    'maria alejandra sequeira',
    'maria fernanda brenes',
    'maria fernanda jimenez',
    'maria jose blanco',
    'maria jose pizarro',
    'maria paula monge',
    'maria paula moreno'
];


list.forEach((name) => {
    const nameArray = name.split(' ');
    const len = nameArray.length;
    let save;
    switch (len) {
        case 1:
            save = {
                name: nameArray[0]
            };
            break;
        case 2:
            save = {
                name: nameArray[0],
                last1: nameArray[1]
            };
            break;
        case 3:
            save = {
                name: nameArray[0],
                middle: nameArray[1],
                last1: nameArray[2]
            };
            break;
        default:
            break;
    }
    if (typeof save === 'object') {
        db.students.insert(save);
        print(db.students.count());
    }
});

db.students.insert({
    name: 'gustavo',
    last1: 'de la torre'
});
print(db.students.count());
db.students.insert({
    name: 'maruja',
    last2: 'conserje primaria'
});
print(db.students.count());
db.students.insert({
    name: 'paula',
    last1: 'sandoval',
    grade: 'preparatorio'
});
print(db.students.count());
db.students.insert({
    name: 'sofia',
    last1: 'perales',
    last2: '(tania)'
});
print(db.students.count());
db.students.insert({
    name: 'andres',
    last1: 'rojas',
    last2: 'viquez'
});
print(db.students.count());
db.students.insert({
    name: 'antonio',
    last1: 'rojas',
    last2: 'dos'
});
print(db.students.count());
