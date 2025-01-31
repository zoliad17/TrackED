import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { LinearGradient } from 'expo-linear-gradient';

const Page = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample student data
  const studentSubjects = [
    {
      name: "Technopreneurship",
      code: "TechnoPre",
      schedule: "MWF 9:00-10:30 AM",
      instructor: "Ms. Lopez",
      attendance: {
        present: 24,
        late: 3,
        absent: 1,
        total: 28
      },
      grades: {
        midterm: null,
        finals: null    
      }
    },
    {
      name: "Ethics",
      code: "GE108",
      schedule: "TTH 1:00-2:30 PM",
      instructor: "Dr. Ople",
      attendance: {
        present: 26,
        late: 2,
        absent: 0,
        total: 28
      },
      grades: {
        midterm: null,
        finals: null       
      }
    },
    {
      name: "Project Management",
      code: "ITElectv3",
      schedule: "MWF 2:00-3:30 PM",
      instructor: "Ms. Libunao",
      attendance: {
        present: 25,
        late: 2,
        absent: 1,
        total: 28
      },
      grades: {
        midterm: null,
        finals: null
      }
    }
  ];

  const SubjectCard = ({ subject }) => (
    <TouchableOpacity
      style={[
        tw.p4,
        tw.roundedLg,
        tw.mB4,
        tw.bgWhite,
        tw.shadow
      ]}
      onPress={() => setSelectedSubject(subject)}
    >
      <Text style={[tw.textLg, tw.fontBold, tw.textBlack]}>
        {subject.name}
      </Text>
      <Text style={[tw.textSm, tw.mT2, tw.textGray600]}>
        Instructor: {subject.instructor}
      </Text>
      <Text style={[tw.textSm, tw.textGray600]}>
        Schedule: {subject.schedule}
      </Text>
      <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter, tw.mT2]}>
        <Text style={[tw.textSm, tw.textGray600]}>
          Attendance:
        </Text>
        <Text style={[tw.fontBold, tw.textBlack]}>
          {((subject.attendance.present / subject.attendance.total) * 100).toFixed(1)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSubjectDetails = () => {
    if (!selectedSubject) return null;

    const attendancePercentage = (selectedSubject.attendance.present / selectedSubject.attendance.total) * 100;

    const AttendanceModal = () => {
      const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={[
            tw.flex1,
            tw.justifyCenter,
            tw.itemsCenter,
            tw.p4,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
          ]}>
            <View style={[
              tw.bgWhite,
              tw.p6,
              tw.roundedLg,
              tw.w4_5,
              tw.itemsCenter,
              tw.shadow2xl
            ]}>
              <View style={[tw.bgGreen200, tw.p3, tw.roundedFull, tw.mB4]}>
                <Text style={[tw.textXl, tw.fontBold, tw.textGreen800]}>✓</Text>
              </View>
              
              <Text style={[tw.textXl, tw.fontBold, tw.textCenter, tw.mB2]}>
                Attendance Recorded
              </Text>
              
              <Text style={[tw.textBase, tw.textCenter, tw.textGray600, tw.mB4]}>
                You have been marked present for{'\n'}{selectedSubject.name}
              </Text>
              
              <Text style={[tw.textSm, tw.textGray500, tw.textCenter, tw.mB4]}>
                {currentDate}
              </Text>

              <TouchableOpacity
                style={[
                  tw.p3,
                  tw.roundedLg,
                  tw.w32,
                  { backgroundColor: '#800000' }
                ]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[tw.textWhite, tw.textCenter, tw.fontBold]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    };

    return (
      <ScrollView style={[tw.p4]}>
        <View style={[tw.mB4]}>
          <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
            <Text style={[tw.textXl, tw.fontBold, tw.textWhite]}>
              {selectedSubject.name}
            </Text>
            <TouchableOpacity
              style={[tw.p3, tw.roundedLg, { 
                backgroundColor: '#800000',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
              }]}
              onPress={() => setSelectedSubject(null)}
            >
              <Text style={[tw.textWhite]}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Attendance Card */}
          <View style={[tw.mT4, tw.p4, tw.roundedLg, tw.bgGray100]}>
            <Text style={[tw.textLg, tw.fontBold, tw.mB4, tw.textBlack]}>
              Attendance Summary
            </Text>
            <View style={[tw.flexRow, tw.justifyBetween, tw.mB4]}>
              <Text style={[tw.textBlack]}>Attendance Rate:</Text>
              <Text style={[tw.fontBold, tw.textBlack]}>
                {attendancePercentage.toFixed(1)}%
              </Text>
            </View>
            <View style={[tw.flexRow, tw.justifyBetween]}>
              <View style={[tw.p2, tw.roundedLg, tw.bgGreen200, tw.flex1, tw.mR2]}>
                <Text style={[tw.textCenter, tw.fontBold]}>{selectedSubject.attendance.present}</Text>
                <Text style={[tw.textCenter, tw.textSm]}>Present</Text>
              </View>
              <View style={[tw.p2, tw.roundedLg, tw.bgYellow200, tw.flex1, tw.mR2]}>
                <Text style={[tw.textCenter, tw.fontBold]}>{selectedSubject.attendance.late}</Text>
                <Text style={[tw.textCenter, tw.textSm]}>Late</Text>
              </View>
              <View style={[tw.p2, tw.roundedLg, tw.bgRed200, tw.flex1]}>
                <Text style={[tw.textCenter, tw.fontBold]}>{selectedSubject.attendance.absent}</Text>
                <Text style={[tw.textCenter, tw.textSm]}>Absent</Text>
              </View>
            </View>
          </View>

          {/* Grades Card */}
          <View style={[tw.mT4, tw.p4, tw.roundedLg, tw.bgGray100]}>
            <Text style={[tw.textLg, tw.fontBold, tw.mB4, tw.textBlack]}>
              Grade Summary
            </Text>
            <View style={[tw.spaceY2]}>
              <View style={[tw.flexRow, tw.justifyBetween]}>
                <Text style={[tw.textBlack]}>Midterm:</Text>
                <Text style={[tw.textBlack]}>
                  {selectedSubject.grades.midterm || 'N/A'}
                </Text>
              </View>
              <View style={[tw.flexRow, tw.justifyBetween]}>
                <Text style={[tw.textBlack]}>Finals:</Text>
                <Text style={[tw.textBlack]}>
                  {selectedSubject.grades.finals || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[tw.p4, {marginBottom: 380 }]}>
          <TouchableOpacity
            style={[
              tw.p4,
              tw.roundedLg,
              tw.wFull,
              tw.itemsCenter,
              {
                backgroundColor: '#800000',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
              }
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text style={[tw.textBase, tw.fontBold, tw.textWhite]}>Scan QR</Text>
          </TouchableOpacity>
        </View>
        <AttendanceModal />
      </ScrollView>
    );
  };

  return (
    <View style={[tw.flex1]}>
      <LinearGradient
        colors={['#800000', '#A52A2A', '#D2691E']}
        style={[tw.flex1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Main Content */}
        <ScrollView style={[tw.flex1, tw.p4]}>
          {selectedSubject ? (
            renderSubjectDetails()
          ) : (
            studentSubjects.map((subject) => (
              <SubjectCard key={subject.code} subject={subject} />
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

export default Page;