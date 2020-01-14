
echo "tag from ENV: $CI_COMMIT_TAG"

str_datetime_safe=`date "+%Y%m%d%H%M%S"`
echo ${str_datetime_safe} 
str_datetime=`date "+%Y-%m-%d %H:%M:%S"`
echo ${str_datetime}

ts_now=`date +%s`

latest_tag_name=`git tag |tail -n 1`
echo ${latest_tag_name}

commit_to_latest_tag=`git show-ref  ${latest_tag_name} | awk  '{print $1}'`
echo ${commit_to_latest_tag}

# get latest tag timestamp and check it
latest_tag_ts=` git log -1 --format=%at   ${commit_to_latest_tag} `
ts_now=`date +%s`
echo "$((${ts_now} - ${latest_tag_ts}))"

#if [ "$((${ts_now} - ${latest_tag_ts}))" -gt 1800 ]
#then
#    echo "No new tags!Refuse to build!"
#    # exit 0
#fi

if [ "$CI_COMMIT_TAG" = "${latest_tag_name}" ]
then 
    echo "tag Matched. building ..." 
else
    echo "No new tags!Refuse to build! "
    exit 0
fi

# checkout the code to the tag
# git checkout ${commit_to_latest_tag}

# replace tag name and commit
VERSION_FILE='./src/views/user/Version.vue'
sed -i -e "s/VERSION/${latest_tag_name}/g" ${VERSION_FILE}
sed -i -e "s/COMMIT/${commit_to_latest_tag}/g" ${VERSION_FILE}
sed -i -e "s/DATETIME/${str_datetime}/g" ${VERSION_FILE}


npm install
npm run build

tar -zcvf /ebusiness/ebfront/ebfront_${latest_tag_name}.tar.gz ./dist/

USERNAME=ocloud
PASSWORD=DS918@qwert
IP=192.168.40.18
DIST=/OCloudwareShare/cr11g_es
FILENAME=/ebusiness/ebfront/ebfront_${latest_tag_name}.tar.gz

sftp_send(){
lftp -u "${USERNAME}","${PASSWORD}" sftp://"${IP}"<<EOF
cd ${DIST}
mput ${FILENAME}
bye
EOF
}


#copy file to  pack
export pack_dir=/ebusiness/ebfront
if [ -d $pack_dir ]
then
    echo "pack dir exist, copy file"

    sftp_send
    
else
    echo "pack dir does not exist, do not copy file"
fi

