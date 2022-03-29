bash_prod:
	docker-compose -f docker-compose.prod.yml exec web sh

rebuild_prod:
	docker-compose -f docker-compose.prod.yml up -d --build
	docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
	docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear

rebuild_down_prod:
	docker-compose -f docker-compose.prod.yml down -v
	docker-compose -f docker-compose.prod.yml up -d --build
	docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
	docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear

restart_prod:
	docker-compose -f docker-compose.prod.yml restart db
	docker-compose -f docker-compose.prod.yml restart web
	docker-compose -f docker-compose.prod.yml restart nginx

makemigrations_prod:
	docker-compose -f docker-compose.prod.yml exec web python manage.py makemigrations --noinput

migrate_prod:
	docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput

collectstatic:
	docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear

bash_dev:
	docker-compose exec web_dev sh

rebuild_dev:
	docker-compose up -d --build
	docker-compose exec web_dev python manage.py migrate --noinput

rebuild_down_dev:
	docker-compose down -v
	docker-compose up -d --build
	docker-compose exec web_dev python manage.py migrate --noinput

restart_dev:
	docker-compose restart db_dev
	docker-compose restart web_dev

makemigrations_dev:
	docker-compose exec web_dev python manage.py makemigrations --noinput

migrate_dev:
	docker-compose exec web_dev python manage.py migrate --noinput

dumpdata_dev:
	docker-compose run --rm web_dev python manage.py dumpdata --indent 4

loaddata_dev:
	docker-compose run --rm web_dev python manage.py loaddata 

backup_dev:
	docker-compose run --rm web_dev psql -h db_dev -U shopping_cart -p shopping_cart -d shopping_cart_dev 