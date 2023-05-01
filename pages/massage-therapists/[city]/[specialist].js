import MassageSpecialistDetail from 'containers/MassageSpecialists/massageSpecialistDetail';
import { getProjectPerTherapist, getPerTherapistData } from 'services';
import { statusCheck, formatDate } from 'util/config';

export const getServerSideProps = async (ctx) => {
  try {
    const { params, query } = ctx;

    let responseProject = await getProjectPerTherapist({
      slug: params.specialist,
    });
    if (statusCheck(responseProject)) {
      let defaultExist = false,
        projectId = 0,
        mainData = {};
      responseProject.data.data.map((element) => {
        if (element.default) {
          defaultExist = true;
          projectId = element.id;
        }
      });
      if (!defaultExist) {
        projectId = responseProject.data.data[0].id;
      }
      if (projectId) {
        let response = await getPerTherapistData({
          slug: params.specialist,
          projectId: query.projectId ? +query.projectId : projectId,
          dateTime: query.dateValue
            ? formatDate(new Date(query.dateValue))
            : formatDate(new Date()),
        });

        mainData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
      }
      return {
        props: {
          massageData: {
            manager_first_name: mainData.manager_first_name,
            manager_last_name: mainData.manager_last_name,
            tag_line: mainData.tag_line,
            profile_photo: mainData.profile_photo,
          },
        },
      };
    }
    return {
      props: {
        massageData: {},
      },
    };
  } catch (error) {
    return {
      props: {
        massageData: {},
      },
    };
  }
};

export default MassageSpecialistDetail;
