from fabric.api import local, env, run, put, cd, settings

DEPLOY_DIR = "/home/iotissue"
APP_DIR = "/home/iotissue/iotissue_app"
APP_NAME = "iotissue_app"

env.hosts = ['iotissue@192.168.33.38']


def package_dir():
    local("tar cvzf {0}.tar.gz `git ls-files`".format(APP_NAME))


def upload():
    run("mkdir -p /tmp/fabric-uploads")
    put("{0}.tar.gz".format(APP_NAME), "/tmp/fabric-uploads")


def clean():
    run("rm -r /tmp/fabric-uploads")
    local("rm {0}.tar.gz".format(APP_NAME))


def extract():
    run("mkdir -p {0}".format(APP_DIR))
    run("tar xvzf /tmp/fabric-uploads/{0}.tar.gz -C {1}".format(APP_NAME, APP_DIR))


def install_deps():
    with cd(APP_DIR):
        run("npm install")


def start_app():
    with settings(warn_only=True):
        if run("pm2 show {0}".format(APP_NAME)).failed:
            with cd(DEPLOY_DIR):
                run("pm2 start {0}".format(APP_DIR))
    run("pm2 reload {0}".format(APP_NAME))


def deploy():
    package_dir()
    upload()
    extract()
    install_deps()
    start_app()
    clean()
